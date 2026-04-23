import os
from slowapi import Limiter

def _get_limiter_key(request):
    """
    Groups rate limit by X-API-Key if present, otherwise by client IP.
    Ensures clients sharing the same IP but using different API keys have
    independent limits, while anonymous abuse from the same IP is unified.
    """
    api_key = request.headers.get("X-API-Key")
    if api_key:
        return api_key

    # Fallback to client IP
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"

# Rate limiter can be disabled via RATE_LIMIT_ENABLED=false for tests
limiter = Limiter(
    key_func=_get_limiter_key,
    enabled=os.environ.get("RATE_LIMIT_ENABLED", "true").lower() != "false"
)
