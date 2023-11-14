const healthOffers = {
    "Lookfantastic": 12566,
    "Sephora":	13271,
    "Lovehoney": 5319,
    "Charlotte Tilbury": 15090,
    "GHD":	8137,
    "ESPA":	15704,
    "Cult Beauty": 16161,
    "Liz Earle": 17873,
    "Elemis": 16455,
    "Benefit Cosmetics": 231,
    "Ann Summers": 270
}

const fashionOffers = {
    'Debenhams': 811,
    'Lounge': 20954,
    'Ted Baker': 16841,
    'Boohoo': 12657,
    'Boux Avenue': 9376,
    'Flannels':	24140,
    'TU Clothing': 34658,
    'BoohooMan': 10735,
    'Ray-Ban':	6765,
    'Fenwicks':	32538,
    'Harvey Nichols': 21613,
    'Coast': 790
}

const footwearOffers = {
    "JD Sports": "423",
    "Footasylum": "1473",
    "Office Shoes": "384",
    "UGG": "16397",
    "Foot Locker": "21684",
    "Fitflop": "16010",
    "Crocs": "1455",
    "Kickers": "15607",
    "Kurt Geiger": "15923",
    "Hoka": "16571"
}

const techOffers = {
    "Samsung": "6306",
    "LG": "33928",
    "EE": "6899",
    "Sky": "4229",
    "Plusnet": "8927",
    "Virgin Media": "3462",
    "Reward Mobile": "10725"
}

const sportsOffers = {
    "Sports Direct": "16990",
    "Myprotein": "1521",
    "Garmin": "16917",
    "Halfords": "141",
    "Blacks": "150",
    "Millets": "149",
    "Go Outdoors": "4254",
    "Craghoppers": "5974",
    "Columbia": "29230",
    "Berghaus": "7402"
}

const homeOffers = {
    "Ninja Kitchen": "16290",
    "Shark": "16289",
    "Curry's": "211",
    "Silent Night": "22058",
    "Dreamcloud": "27486",
    "Homebase": "228",
    "Hotpoint": "3826",
    "Lakeland": "26281",
    "JBL": "25867",
    "Hoover": "15462"
}

const holidaysOffers = {
    "Booking.com": "22960",
    "Loveholidays": "26008",
    "Hotels.com": "5315",
    "Expedia": "387",
    "Jet2 Holidays": "239",
    "Cineworld": "809",
    "Alton Towers Resort": "249",
    "Parkdean Resorts": "3285",
    "Butlins": "4544",
    "Holiday Extras": "120"
}

const foodOffers = {
    "Bills": "24239",
    "Virgin Wines": "3351",
    "Skinny Foods": "19088",
    "Muscle Food": "3544",
    "Iceland": "9464",
    "Grenade": "4297",
    "Whittards of Chelsea": "1570"
}

const giftOffers = {
    "Virgin Experience Days": "471",
    "BuyaGift": "15",
    "Not on the High Street": "24788",
    "Shopdisney": "9228",
    "Yankee Candle": "9652",
    "Goldsmiths": "39",
    "Abbott Lyon": "13857",
    "Card Factory": "27809",
    "Hornby": "26709",
    "Scaletrix": "26712"
}

const transformedData = Object.entries(foodOffers).map(([key, value]) => {
    return {
        imgSrc:
          `https://cdn.bluelightcard.co.uk/companyimages/complarge/retina/${value}.jpg`,
        title: key,
        link: `/offerdetails.php?cid=${value}`,
    };
});

console.log(transformedData)