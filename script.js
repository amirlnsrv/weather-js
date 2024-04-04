const link =
  "http://api.weatherapi.com/v1/current.json?key=54bdc48438c246609c265604243103";

const root = document.getElementById("root");
const popup = document.getElementById("popup");
const textInput = document.getElementById("text-input");
const form = document.getElementById("form");
const close = document.getElementById("close");

let store = {
  city: "Moscow",
  temperature: 0,
  observationTime: "00:00 AM",
  isDay: 1,
  description: "",
  properties: {
    cloud: {},
    humidity: {},
    windSpeed: {},
    pressure: {},
    uvIndex: {},
    visibillity: {},
  },
};

const fetchData = async () => {
  try {
    const query = localStorage.getItem("query") || store.city;
    const result = await fetch(`${link}&q=${query}`);
    const data = await result.json();

    const {
      current: {
        cloud,
        temp_c,
        last_updated: observationTime,
        pressure_mb: pressure,
        humidity,
        uv: uvIndex,
        vis_km,
        is_day: isDay,
        condition: description,
        wind_kph: windSpeed,
      },
      location: { name: city },
    } = data;

    store = {
      ...store,
      city,
      isDay,
      temperature: temp_c,
      observationTime,
      description: description.text,
      properties: {
        cloud: {
          title: "cloud",
          value: `${cloud}%`,
          icon: "cloud.png",
        },
        humidity: {
          title: "humidity",
          value: `${humidity}%`,
          icon: "humidity.png",
        },
        windSpeed: {
          title: "windSpeed",
          value: `${windSpeed} km/h`,
          icon: "wind.png",
        },
        pressure: {
          title: "pressure",
          value: `${pressure}%`,
          icon: "gauge.png",
        },
        uvIndex: {
          title: "uv Index",
          value: `${uvIndex} / 100`,
          icon: "uv-index.png",
        },
        visibillity: {
          title: "visibillity",
          value: `${uvIndex}%`,
          icon: "visibility.png",
        },
      },
    };

    renderComponent();
  } catch (error) {
    console.log("Произошла ашибка!", error);
  }
};

const getImage = (description) => {
  const value = description.toLowerCase();

  switch (value) {
    case "partly cloudy":
      return "partly.png";
    case "sunny":
      return "sunny.png";
    case "clear":
      return "clear.png";
    case "fog":
      return "fog.png";
    case "cloudy":
      return "cloud.png";

    default:
      return "the.png";
  }
};

const renderProperty = (properties) => {
  return Object.values(properties)
    .map(({ title, value, icon }) => {
      return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
          </div>`;
    })
    .join("");
};

const markup = () => {
  const { city, description, observationTime, temperature, isDay, properties } =
    store;

  const containerClass = isDay === 1 ? "is-day" : "";

  return `<div class="container ${containerClass}">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                  <img class="icon" src="./img/${getImage(
                    description
                  )}" alt="" />
                  <div class="description">${description}</div>
                </div>

                <div class="top-right">
                  <div class="city-info__subtitle">as of ${observationTime}</div>
                  <div class="city-info__title">${temperature}°</div>
                </div>
              </div>
            </div>
            <div id="properties">${renderProperty(properties)}</div>
          </div>`;
};

const togglePopupClass = () => {
  popup.classList.toggle("active");
};

const renderComponent = () => {
  root.innerHTML = markup();

  const city = document.getElementById("city");
  city.addEventListener("click", togglePopupClass);
};

close.addEventListener("click", togglePopupClass);

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value,
  };
};

const handleSubmit = (e) => {
  e.preventDefault();
  const value = store.city;

  if (!value) return null;

  localStorage.setItem("query", value);

  fetchData();
  togglePopupClass();
};

form.addEventListener("submit", handleSubmit);
textInput.addEventListener("input", handleInput);

fetchData();
