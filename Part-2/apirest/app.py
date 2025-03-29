from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import joblib
import unicodedata
import contractions
from nltk import word_tokenize
import re
from num2words import num2words
from nltk.stem import SnowballStemmer, WordNetLemmatizer
from nltk.corpus import stopwords
import nltk
import joblib
import spacy
import joblib
from sklearn.metrics import precision_score, recall_score, f1_score






#App fast api
nlp = spacy.load("es_core_news_md")
app=FastAPI()
# Descargar recursos necesarios
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')

# Inicializar herramientas de NLP
spanish_stemmer = SnowballStemmer('spanish')
lemmatizer = WordNetLemmatizer()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes restringirlo a dominios específicos
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Permitir todos los headers
)

class Item(BaseModel):
    titulo: str
    descripcion:str
    
class ItemTrain(BaseModel):
    titulo: str
    descripcion:str
    label:int
    
@app.post("/predecir", response_model=List[dict])
async def predecirValores(items:List[Item]):
    try:
        pipeline = joblib.load("modelo_fake_news.pkl")
        resultado=predecir_noticias(items,pipeline)
        return resultado
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Datos incorrectos")
        

def to_lowercase(words):
    return [w.lower() for w in words if w]

def replace_numbers(words):
    return [num2words(w, lang='es') if w.isdigit() else w for w in words]

def remove_punctuation(words):
    return [re.sub(r'[^\w\s]', '', w) for w in words if w and re.sub(r'[^\w\s]', '', w) != '']

def remove_non_ascii(words):
    return [unicodedata.normalize('NFKD', w).encode('ascii', 'ignore').decode('utf-8') for w in words if w]

def remove_stopwords(words):
    return [w for w in words if w.lower() not in stopwords.words('spanish')]

def preprocessing(words):
    words = to_lowercase(words)
    words = replace_numbers(words)
    words = remove_punctuation(words)
    words = remove_non_ascii(words)
    words = remove_stopwords(words)
    return words

def stem_words(words):
    stemmer = SnowballStemmer("spanish")
    return [stemmer.stem(w) for w in words]

def lemmatize_verbs(words):
    doc = nlp(" ".join(words))
    return [token.lemma_ if token.pos_ == "VERB" else token.text for token in doc]

def stem_and_lemmatize(words):
    return stem_words(words) + lemmatize_verbs(words)

def clean_and_prepare_texts(titulo, descripcion):
    # Expandir contracciones
    titulo = contractions.fix(str(titulo))
    descripcion = contractions.fix(str(descripcion))

    # Tokenizar
    titulo_tokens = word_tokenize(titulo)
    descripcion_tokens = word_tokenize(descripcion)

    # Preprocesar
    titulo_clean = preprocessing(titulo_tokens)
    descripcion_clean = preprocessing(descripcion_tokens)

    # Stemming y lematización
    titulo_final = stem_and_lemmatize(titulo_clean)
    descripcion_final = stem_and_lemmatize(descripcion_clean)

    # Unir tokens a texto
    texto_total = " ".join(titulo_final + descripcion_final)
    return texto_total
#Funcion de predecir
def predecir_noticias(lista_noticias,pipeline):
    """
    lista_noticias: lista de dicts con 'titulo' y 'descripcion'
    Devuelve: lista de dicts con 'prediction' y 'probability'
    """
    
    textos_limpios = [
        clean_and_prepare_texts(lista_noticias[n].titulo, lista_noticias[n].descripcion)
        for n in range(len(lista_noticias))
    ]

    predicciones = pipeline.predict(textos_limpios)
    probabilidades = pipeline.predict_proba(textos_limpios)

    return [
        {
            "prediction": int(p),
            "probability": float(max(prob))
        }
        for p, prob in zip(predicciones, probabilidades)
    ]



@app.post("/reentrenar", response_model=dict)
async def predecirValores(items:List[ItemTrain]):
    try:
        respuestaModelo=reentrenar_modelo(items)
        return respuestaModelo
    except NameError as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Datos incorrectos")
        

#Funcion de reentrenar

def reentrenar_modelo(nuevos_datos):
    """
    nuevos_datos: lista de dicts con 'titulo', 'descripcion' y 'label'
    Devuelve: metricas del nuevo modelo
    """
    pipeline = joblib.load("modelo_fake_news.pkl")
    vectorizer = pipeline.named_steps['vectorizer']
    classifier = pipeline.named_steps['classifier']

    textos = [
        clean_and_prepare_texts(n.titulo, n.descripcion)
        for n in nuevos_datos
    ]
    etiquetas = [n.label for n in nuevos_datos]

    X_new = vectorizer.transform(textos)
    classifier.partial_fit(X_new, etiquetas)

    joblib.dump(pipeline, "modelo_fake_news.pkl")

    y_pred = classifier.predict(X_new)
    return {
        "mag": "El modelo se reentreno correctamente",
        "precision": round(precision_score(etiquetas, y_pred), 4),
        "recall": round(recall_score(etiquetas, y_pred), 4),
        "f1_score": round(f1_score(etiquetas, y_pred), 4),
        "samples_used": len(etiquetas)
    }


