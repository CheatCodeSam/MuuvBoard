FROM python:3.9.4-slim-buster

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
  && apt-get -y install gcc postgresql \
  && apt-get clean

RUN pip install --upgrade pip
RUN pip install poetry
COPY pyproject.toml .
RUN poetry config virtualenvs.create false
RUN poetry install

COPY . .