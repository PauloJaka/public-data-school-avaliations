from pydantic import BaseModel


class ErrorResponse(BaseModel):
    request_id: str
    error_code: str
    message: str
