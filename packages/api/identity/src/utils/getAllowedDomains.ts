const getAllowedDomains = (stage: string) => {
    const allowedLocalDomains = 'http://localhost:3000, http://localhost:8080';

    const allowedDomains = { 
        production: 'https://www.bluelightcard.co.uk, https://www.bluelightcard.com.au, https://www.defencediscountservice.co.uk',
        staging: 'https://www.staging.bluelightcard.co.uk, https://www.staging.bluelightcard.tech, https://www.develop.bluelightcard.com.au, https://www.ddsstaging.bluelightcard.tech',
    }

    if (stage === 'production') return allowedDomains.production;
    if (stage === 'staging') return allowedDomains.staging;
    return allowedLocalDomains;
}

export default getAllowedDomains