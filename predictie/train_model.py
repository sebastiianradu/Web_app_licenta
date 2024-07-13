import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
import pickle
import numpy as np

# Încarcă datele într-un DataFrame
data = pd.read_csv('predictie/historical_prices.csv')

# Preprocesează datele
data['date-time'] = pd.to_datetime(data['date-time'])
data['month'] = data['date-time'].dt.month
data['year'] = data['date-time'].dt.year

# Transformă variabilele categorice
data = pd.get_dummies(data, columns=['type_of_article', 'category'])

# Selectează caracteristicile relevante și ținta
features = ['month', 'year'] + [col for col in data.columns if 'type_of_article_' in col or 'category_' in col]
target = 'price'

X = data[features]
y = data[target]

# Împarte datele în seturi de antrenament și testare
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Normalizează datele
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Creează și antrenează modelul
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluează modelul
predictions = model.predict(X_test)
print(f'MAE: {np.mean(np.abs(predictions - y_test))}')
print(f'RMSE: {np.sqrt(np.mean((predictions - y_test) ** 2))}')
print(f'R²: {model.score(X_test, y_test)}')

# Salvează modelul într-un fișier .pkl
with open('price_prediction_model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Salvează scaler-ul într-un fișier .pkl
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
