#!/usr/bin/env python3

import aws_cdk as cdk

from cdk.cdk_stack import CDKStack

app = cdk.App()

CDKStack(app, "VcioStack")

app.synth()