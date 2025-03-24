# Agentic Profile Test Service

Provides short lived agentic profile hosting.

## Creating a web hosted agentic profile

With this service running locally:

	$ node test/create-local-agentic-profile

## Configuring AWS

1. Create a Lambda function
	- Node 22.x
	- ARM CPU
2. Configure a new HTTP API Gateway 
	- When listing APIs, click "Create API" button
	- Under HTTP API, click "Build"
	- API name: agentic-profile-test-api
	- Integrations: Lambda
	- Lambda function: ...test-service
	- Version: 1.0
	- "Create"
3. Create a Custom Domain Name
	- Ensure an SSL certificate for the domain name
	- Domain name: test-api.agenticprofile.ai
4. Use Route 53 to map the endpoint to the API gateway
5. Make sure to add AWS lambda permissions
6. Make sure to add Custom domain API mapping