import os
import mercadopago
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("MP_ACCESS_TOKEN")
print("Token cargado:", token)

sdk = mercadopago.SDK(token)

user_info = sdk.http_client.get(
    "https://api.mercadopago.com/users/me",
    headers={"Authorization": f"Bearer {os.getenv('MP_ACCESS_TOKEN')}"}
)
print(user_info)



# Crear pago de prueba en sandbox
payment_data = {
    "transaction_amount": 100,
    "token": "fake-valid-card-token",  # token de tarjeta para sandbox
    "description": "Pago de prueba",
    "installments": 1,
    "payment_method_id": "visa",
    "payer": {
        "email": user_info["response"]["email"]
    }
}

payment_response = sdk.payment().create(payment_data)
print("Respuesta creación de pago:")
print(payment_response)
