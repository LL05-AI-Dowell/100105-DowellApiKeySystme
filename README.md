## API Key Processing

The Process API Key service allows you to decrement the credits associated with an API key by passing the API key and the API services you wish to use. This documentation provides an overview of how to use the service and the possible responses you can expect.

### API Endpoint

_POST_ `https://100105.pythonanywhere.com/api/v1/process-api-key/`

### Request Parameters

The service expects a JSON payload with the following parameters:

- `api_key` (string): The API key you want to process.
- `api_service_id` (string): The API services you intend to use (Hard-code your api service id)

### Example Usage

You can use the provided Python function `processApikey` to interact with the service. Here's an example of how to retrieve the count and handle the different responses:

```python
import requests

def processApikey(api_key, api_service_id):
    url = 'https://100105.pythonanywhere.com/api/v1/process-api-key/'
    payload = {
        "api_key" : api_key,
        "api_service_id" : api_service_id
    }

    response = requests.post(url, json=payload)
    return response.text
```

### Response Structure

The service can return the following JSON responses based on the provided API key and API services:

- If the API key and API services combination does not exist:

```json
{
  "success": false,
  "message": "API key does not exist or the combination is invalid"
}
```

- If the API key and API services combination are valid and the credits are decremented:

```json
{
  "success": true,
  "message": "The count is decremented",
  "count": "<Count>"
}
```

- If the API key's credits have been exceeded:

```json
{
  "success": true,
  "message": "Limit exceeded"
}
```

- If the API key is inactive:

```json
{
  "success": true,
  "message": "API key is inactive"
}
```

Make sure to handle these responses appropriately in your application logic.

### Use API_SERVICE_ID (Hardcode the api service ID)

1. API service ID: DOWELL10003
   API service name: DoWell Secure Github Repository

2. API service ID: DOWELL10004
   API service name: DoWell Classification of Big Data

3. API service ID: DOWELL10005
   API service name: DoWell Surveys

4. API service ID: DOWELL10006
   API service name: DoWell Shuffling of Big data

5. API service ID: DOWELL10007
   API service name: DoWell Subscribe Newsletter

6. API service ID: DOWELL10008
   API service name: DoWell Coordinates

7. API service ID: DOWELL10009
   API service name: Living Lab scale

8. API service ID: DOWELL100010
   API service name: DoWell Statistical distributions from Bigdata

9. API service ID: DOWELL100011
   API service name: DoWell Permutation

10. API service ID: DOWELL100012
    API service name: DoWell Payments

11. API service ID: DOWELL100013
    API service name: DoWell Open Source License Compatibility check

12. API service ID: DOWELL100014
    API service name: Dowell QR Code Generator

13. API service ID: DOWELL100015
    API service name: Living Lab Maps

14. API service ID: DOWELL100016
    API service name: DoWell Geometrical layout of Big Data

15. API service ID: DOWELL100017
    API service name: DoWell Central tendencies of Big data distributions

16. API service ID: DOWELL100018
    API service name: DoWell Email