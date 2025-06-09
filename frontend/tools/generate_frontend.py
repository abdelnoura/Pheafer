import openai

# Debug print so we know the script runs:
print("🔍 generate_frontend.py is running…")

# 1. Paste your real API key here (keep the quotes exactly):
import os
openai.api_key = os.getenv("OPENAI_API_KEY")

def ask_codex(prompt_text, filename_to_save):
    """
    Sends prompt_text to a ChatCompletion model (gpt-3.5-turbo) 
    to generate code, then writes that code into filename_to_save.
    """
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant who generates code. Be sure to output only the raw code text."
            },
            {
                "role": "user",
                "content": prompt_text
            }
        ],
        temperature=0.0,
        max_tokens=1500
    )

    # The assistant’s reply is in response.choices[0].message.content
    code_output = response.choices[0].message.content

    # Write the generated code into the desired file
    with open(filename_to_save, "w") as f:
        f.write(code_output)

    print(f"✅ Generated code saved to: {filename_to_save}")

if __name__ == "__main__":
    # Example prompt: generate a simple React component in src/App.jsx
    sample_prompt = """
Create a new file at src/App.jsx. Write a React component named App that displays "Hello, Pheafer!" in an <h1> tag.
- Use functional React and import React at the top.
- Do not include any extra explanation or comments—output only the plain code.
"""
    ask_codex(sample_prompt, "../src/App.jsx")
