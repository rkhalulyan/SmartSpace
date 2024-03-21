FROM python:3.9-slim

COPY . /backend

WORKDIR /backend

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]