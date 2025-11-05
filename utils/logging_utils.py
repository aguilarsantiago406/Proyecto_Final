import logging


logger = logging.getLogger("ghl_mp_app")


def log_info(message: str, **extra):
    logger.info(message, extra=extra)


def log_error(message: str, **extra):
    logger.error(message, extra=extra)