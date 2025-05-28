

from app.llm_utils.generate_response_vectors import cauta_context

async def generate_response_from_LLM(user_message: str) -> str:
        context = cauta_context(user_message)
        return context