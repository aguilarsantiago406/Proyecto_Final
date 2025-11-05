import base64


def encrypt_token(token: str) -> str:
    """Placeholder de cifrado: base64 (reemplazar por Fernet/AES)."""
    return base64.b64encode(token.encode()).decode()


def decrypt_token(token_b64: str) -> str:
    return base64.b64decode(token_b64.encode()).decode()