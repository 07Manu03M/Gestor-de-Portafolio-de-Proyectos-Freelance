# Gestor de Portafolio Freelance CLI

## ✨ Descripción del Proyecto

Este es un sistema de consola (CLI) para la **gestión de portafolio de proyectos freelance**, desarrollado con Node.js y MongoDB. Permite registrar, actualizar y consultar información relacionada con clientes, propuestas, proyectos, contratos, avances y finanzas.

El sistema está diseñado para mejorar la organización y seguimiento de actividades propias del trabajo independiente, aplicando principios de diseño de software profesional como **SOLID**, **patrones de diseño** y buenas prácticas de arquitectura.

## ⚙️ Instrucciones de Instalación y Uso

### Requisitos

* Node.js >= 18
* MongoDB ejecutándose localmente en `mongodb://localhost:27017`

### Instalación

```bash
npm install
```

### Ejecución

```bash
node app.js
```

### Librerías Usadas

* `inquirer`: para el menú interactivo
* `prompt-sync`: para validaciones en algunos modelos
* `mongodb`: para la conexión y persistencia de datos

## 🗂️ Estructura del Proyecto

```
├── app.js
├── config
│   └── db.js
├── comands
│   └── gestion*.js
├── factories
│   └── *.Factory.js
├── models
│   └── *.js
├── service
│   └── *.js
├── README.md
```

## ✍️ Principios SOLID Aplicados

1. **S - Single Responsibility**: Cada clase (modelo, repositorio, factory) tiene una única responsabilidad clara.
2. **O - Open/Closed**: Los factories permiten crear instancias sin modificar las clases.
3. **L - Liskov Substitution**: Aunque no se hereda mucho, los objetos creados pueden intercambiarse por sus tipos esperados.
4. **I - Interface Segregation**: No se aplicó explícitamente, ya que no se usaron interfaces formales ni contratos desacoplados entre módulos. La lógica se mantuvo en clases separadas, pero sin aplicar este principio de manera rigurosa.
5. **D - Dependency Inversion**: Las factories y servicios dependen de abstracciones (estructuras de datos), no de implementaciones directas.

## 🧰 Patrones de Diseño Usados

| Patrón             | Uso                                                  |
| ------------------ | ---------------------------------------------------- |
| **Factory Method** | Creación de entidades en `*.Factory.js`              |
| **Repository**     | Acceso y persistencia de datos en `service/*.js`     |
| **Singleton**      | En `db.js`, garantizando una sola conexión a MongoDB |

## 📚 Consideraciones Técnicas

* Cada entidad está modelada como una clase con validaciones propias.
* Se usaron transacciones en MongoDB para registrar ingresos y egresos financieros con atomicidad.
* Se controla el estado de entidades y se valida el cumplimiento de reglas de negocio (por ejemplo, porcentajes de avance, estados de proyecto, etc).
* Se separaron las capas de presentación, dominio y persistencia para facilitar el mantenimiento.

## 👥 Créditos

* Desarrollador Principal: Manuel Meneses
* Repositorio: [Enlace al GitHub](https://github.com/07Manu03M/Gestor-de-Portafolio-de-Proyectos-Freelance.git)
* Tablero Scrum Trello: (https://trello.com/invite/b/68903357c85e0c0bc910b93d/ATTIacedc0ca3962f4f697b2bf84b64e647bF2484421/aplicacion-freelancer)
* Ver Video y Documentacion del proyecto aqui: (https://drive.google.com/drive/folders/1RVJRljKX8gg7BxZ54k8-43XeKWAoRKFM?usp=sharing)

---


