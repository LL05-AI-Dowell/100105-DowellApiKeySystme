
## API Key Processing

The Process API Key service allows you to decrement the credits associated with an API key by passing the API key and the API services you wish to use. This documentation provides an overview of how to use the service and the possible responses you can expect.

### API Endpoint

_POST_ `https://100105.pythonanywhere.com/api/v1/process-api-key/`

### Request Parameters

The service expects a JSON payload with the following parameters:

- `api_key` (string): The API key you want to process.
- `api_services` (string): The API services you intend to use.

### Example Usage

You can use the provided Python function `processApikey` to interact with the service. Here's an example of how to retrieve the count and handle the different responses:

```python
import requests

def processApikey(api_key, api_services):
    url = 'https://100105.pythonanywhere.com/api/v1/process-api-key/'
    payload = {
        "api_key" : api_key,
        "api_services" : api_services
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
