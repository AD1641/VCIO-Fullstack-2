from aws_cdk import (
    Stack,
    RemovalPolicy,
    CfnOutput,
    Duration,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_lambda as _lambda,
    aws_apigateway as apigateway,
)

from constructs import Construct


class CDKStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs):
        super().__init__(scope, construct_id, **kwargs)

        # Frontend Hosting Bucket
        frontend_bucket = s3.Bucket(
            self,
            "VcioFrontendBucket",
            website_index_document="index.html",
            public_read_access=False,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
        )

        # CloudFront Distribution
        distribution = cloudfront.Distribution(
            self,
            "VcioDistribution",
            default_behavior={
                "origin": origins.S3BucketOrigin(frontend_bucket)
            },
        )

        # Placeholder Flask Lambda
        backend_lambda = _lambda.Function(
            self,
            "VcioBackendLambda",
            runtime=_lambda.Runtime.PYTHON_3_12,
            handler="index.handler",
            code=_lambda.Code.from_inline(
                """
                def handler(event, context):
                    return {
                        "statusCode": 200,
                        "body": "vCIO backend running"
                    }
                """
            ),
            timeout=Duration.seconds(30),
        )

        # API Gateway
        api = apigateway.LambdaRestApi(
            self,
            "VcioApi",
            handler=backend_lambda,
            proxy=True,
        )

        # Outputs
        CfnOutput(
            self,
            "CloudFrontURL",
            value=distribution.distribution_domain_name,
        )

        CfnOutput(
            self,
            "ApiURL",
            value=api.url,
        )