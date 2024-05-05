import moment from "moment";

export const getHTMLForTicket = (
  eventId,
  ticketId,
  qrCode,
  eventName,
  startDate,
  endDate,
  address
) => {
  const html = `
    <html>
        <head>
        <style>
            @import url("https://fonts.googleapis.com/css2?family=Staatliches&display=swap");
            @import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body,
        html {
            height: 100vh;
            display: grid;
            font-family: "Staatliches", cursive;

            color: black;
            font-size: 14px;
            letter-spacing: 0.1em;
        }

        .ticket {
            margin: auto;
            display: flex;
            background: white;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
        }

        .left {
            display: flex;
        }

        .image {
            height: 250px;
            width: 250px;
            background-image: url("http://localhost:3001/api/event/preview/${eventId}");
            background-size: cover;
            opacity: 0.85;
        }

        .admit-one {
            position: absolute;
            color: darkgray;
            height: 250px;
            padding: 0 10px;
            letter-spacing: 0.15em;
            display: flex;
            text-align: center;
            justify-content: space-around;
            writing-mode: vertical-rl;
            transform: rotate(-180deg);
        }

        .admit-one span:nth-child(2) {
            color: white;
            font-weight: 700;
        }

        .left .ticket-number {
            height: 250px;
            width: 250px;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            padding: 5px;
        }

        .ticket-info {
            padding: 10px 30px;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: space-between;
            align-items: center;
        }

        .date {
            border-top: 1px solid gray;
            border-bottom: 1px solid gray;
            padding: 5px 0;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: space-around;
        }

        .date .june-29 {
            color: #d83565;
            font-size: 20px;
        }

        .show-name {
            font-size: 32px;
            font-family: "Rubik", cursive;
            color: #d83565;
        }

        .show-name h1 {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: #4a437e;
        }

        .time {
            padding: 10px 0;
            color: #4a437e;
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-weight: 700;
        }

        .time span {
            font-weight: 400;
            color: gray;
        }

        .left .time {
            font-size: 16px;
        }


        .location {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            padding-top: 8px;
            border-top: 1px solid gray;
        }

        .location .separator {
            font-size: 20px;
        }

        .right {
            width: 180px;
            border-left: 1px dashed #404040;
        }

        .right .admit-one {
            color: darkgray;
        }

        .right .admit-one span:nth-child(2) {
            color: gray;
        }

        .right .right-info-container {
            height: 250px;
            padding: 10px 10px 10px 35px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
        }

        .right .show-name h1 {
            font-size: 18px;
        }

        .barcode {
            height: 100px;
        }

        .barcode img {
            height: 100%;
        }

        .right .ticket-number {
            color: gray;
            text-align: center;
        }

            </style>
        </head>
    <body>
    <div class="ticket">
        <div class="left">
            <div class="image">
            </div>
            <div class="ticket-info">
                <p class="date">
                    <span class="june-29">${moment(startDate).format(
                      "LL"
                    )}</span>
                </p>
                <div class="show-name">
                    <h1>${eventName}</h1>
                </div>
                <div class="time">
                    <p>${moment(startDate).format(
                      "lll"
                    )} <span>TO</span> ${moment(endDate).format("lll")}</p>
                </div>
                <p class="location">
                    <span>${address}</span>
                </p>
            </div>
        </div>
        <div class="right">
            <p class="admit-one">
                <span>UEVENT</span>
                <span>UEVENT</span>
                <span>UEVENT</span>
            </p>
            <div class="right-info-container">
                <div class="time">
                    <p>${moment(startDate).format(
                      "lll"
                    )} <span>TO</span> ${moment(endDate).format("lll")}</p>
                </div>
                <div class="barcode">
                    <img c src=${qrCode} alt="QR code">
                </div>
                <p class="ticket-number">
                    ${ticketId}
                </p>
            </div>
        </div>
    </div>
        </body>
        
        </html>
    `;
  return html;
};
