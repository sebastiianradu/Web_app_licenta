import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
import pickle
import numpy as np

data = pd.read_csv('predictie/historical_prices.csv')

data['date-time'] = pd.to_datetime(data['date-time'])
data['month'] = data['date-time'].dt.month
data['year'] = data['date-time'].dt.year

data = pd.get_dummies(data, columns=['type_of_article', 'category'])

features = ['month', 'year'] + [col for col in data.columns if 'type_of_article_' in col or 'category_' in col]
target = 'price'

X = data[features]
y = data[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

model = LinearRegression()
model.fit(X_train, y_train)

predictions = model.predict(X_test)
print(f'MAE: {np.mean(np.abs(predictions - y_test))}')
print(f'RMSE: {np.sqrt(np.mean((predictions - y_test) ** 2))}')
print(f'R²: {model.score(X_test, y_test)}')

with open('price_prediction_model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
