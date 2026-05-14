from aws_cdk import (
    Stack,
    RemovalPolicy,
    CfnOutput,
    aws_ec2 as ec2,
    aws_rds as rds,
    aws_ecs as ecs,
    aws_ecs_patterns as ecs_patterns,
    aws_ecr_assets as ecr_assets,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_s3_deployment as s3deploy,
)

from constructs import Construct


class FullstackStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs):
        super().__init__(scope, construct_id, **kwargs)

        # VPC
        vpc = ec2.Vpc(
            self,
            "AppVpc",

            max_azs=2,
        )

        # DATABASE
        database = rds.DatabaseInstance(
            self,
            "PostgresDB",

            engine=rds.DatabaseInstanceEngine.postgres(
                version=rds.PostgresEngineVersion.VER_15
            ),

            vpc=vpc,

            credentials=rds.Credentials.from_generated_secret(
                "postgres"
            ),

            allocated_storage=20,

            max_allocated_storage=100,

            publicly_accessible=False,

            removal_policy=RemovalPolicy.DESTROY,
        )

        # ECS CLUSTER
        cluster = ecs.Cluster(
            self,
            "AppCluster",

            vpc=vpc,
        )

        # FLASK BACKEND CONTAINER
        backend_service = (
            ecs_patterns.ApplicationLoadBalancedFargateService(
                self,
                "BackendService",

                cluster=cluster,

                cpu=512,
                memory_limit_mib=1024,

                desired_count=1,

                task_image_options=ecs_patterns.ApplicationLoadBalancedTaskImageOptions(
                    image=ecs.ContainerImage.from_asset(
                        "../../vcio-backend-python"
                    ),

                    container_port=5000,

                    environment={
                        "DB_HOST": database.db_instance_endpoint_address,
                        "DB_NAME": "postgres",
                    },
                ),

                public_load_balancer=True,
            )
        )

        # allow ECS container to talk to database
        database.connections.allow_default_port_from(
            backend_service.service
        )

        # FRONTEND
        frontend_bucket = s3.Bucket(
            self,
            "FrontendBucket",

            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
        )

        distribution = cloudfront.Distribution(
            self,
            "FrontendCDN",

            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3Origin(frontend_bucket)
            ),

            default_root_object="index.html",
        )

        s3deploy.BucketDeployment(
            self,
            "DeployFrontend",

            sources=[
                s3deploy.Source.asset(
                    "../../vcio-frontend/build"
                )
            ],

            destination_bucket=frontend_bucket,

            distribution=distribution,
            distribution_paths=["/*"],
        )


        # OUTPUTS
        CfnOutput(
            self,
            "FrontendURL",

            value=f"https://{distribution.distribution_domain_name}",
        )

        CfnOutput(
            self,
            "BackendURL",

            value=f"http://{backend_service.load_balancer.load_balancer_dns_name}",
        )

        CfnOutput(
            self,
            "DatabaseEndpoint",

            value=database.db_instance_endpoint_address,
        )