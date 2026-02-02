
export const fetchFromWebhook = async (message: string, url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}: ${response.statusText}`);
    }

    // Try to parse as JSON first, if it fails, assume it's plain text.
    const responseText = await response.text();
    try {
        const jsonData = JSON.parse(responseText);
        // Pretty-print JSON for better readability in the prompt
        return JSON.stringify(jsonData, null, 2);
    } catch (e) {
        // Not a JSON response, return as plain text
        return responseText;
    }
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`Failed to fetch from webhook: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching from the webhook.');
  }
};
