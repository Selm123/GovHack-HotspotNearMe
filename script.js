
fetch("./data/nsw_contact_tracing_flight.txt")
  .then((response) => response.text())
  .then((text) => {
    const textArray = text.match(
      /{"objectid": "(.*)", "date": "(.*)", "airline": "(.*)", "flight_number": "(.*)", "departure_location": ".*", "departure_time": "(.*)", "arrival_location": "(.*)", "arrival_time": "(.*)", "health_advice": "(.*)"}/g
    ).map(rawData => JSON.parse(rawData));
    console.log(textArray);
    let result = "";

    document.querySelector("#searchBtn").addEventListener("click", () => {
      for (let i = 0; i < textArray.length; i++) {
        if (
          textArray[i].flight_number ===
          document.querySelector("#flight-number").value
        ) {
          result = `<ul>
                        <li>Flight Number: ${textArray[i].flight_number}</li>
                        <li>Date: ${textArray[i].date}</li>
                        <li>Airline: ${textArray[i].airline}</li>
                        <li>Arrival Location: ${textArray[i].arrival_location}</li>
                        <li>Arrival Time: ${textArray[i].arrival_time}</li>
                        <li>Departure Location: ${textArray[i].departure_location}</li>
                        <li>Departure Time: ${textArray[i].departure_time}</li>
                        <li>Health Advice: ${textArray[i].health_advice}</li>
                    </ul>`;
        }
      }
      document.querySelector("#data").innerHTML = result;
    });
  });
