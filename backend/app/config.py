import os

class Config:
    SQLALCHEMY_DATABASE_URI = (
    "mssql+pyodbc://@VIVOBOOK\\SQLEXPRESS/AdventureWorks2022?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
