from together import Together
import logging

# Logger Configuration
logger = logging.getLogger(__name__)

def generate_together_response(model_name: str, user_input: str, api_key: str = None) -> str:
    """
    Generates a response from a Together AI model.

    Args:
        model_name: The name of the Together AI model to use.
        user_input: The user's input message.
        api_key: The Together AI API key. If None, it will attempt to use the TOGETHER_API_KEY environment variable.

    Returns:
        The model's response as a string, or an error message.
    """
    try:
        if api_key:
            client = Together(api_key=api_key)
        else:
            client = Together() #Tries to use the env variable.

        response = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": user_input}],
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        error_message = f"Together AI Error: {e}"
        logger.error(error_message)
        return "Sorry, something went wrong. Please try again later."


# Example usage (replace with your actual API key and model name):
async def generate_response(user_input: str, user_id: str = "default") -> str:
    """
    Integrates the together response into the existing app.
    """
    model = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"
    api_key = "449b5df21e3ee614d3d4bdab1c830e3df1268c17b4855b22845c726dcf3fe78e" #replace with your api key.
    return generate_together_response(model, user_input, api_key)