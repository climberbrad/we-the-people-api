/// <reference types="vite/client" />
interface ImportMeta {
    env: {
        VITE_MONGO_USER: string;
        VITE_MONGO_PWD: string;
        VITE_AUTH0_CLIENT_ID: string;
        VITE_AUTH0_AUDIENCE: string;
        VITE_API_URL: string;
        VITE_PRODUCTION: string;
        VITE_LD_KEY: string;
        VITE_SFDC_OAUTH: string;
        VITE_OUTREACH_CLIENT_ID: string;
        VITE_OUTREACH_REDIRECT_URL: string;
        VITE_SLACK_CLIENT_ID: string;
        VITE_SLACK_REDIRECT_URL: string;
        VITE_HUBSPOT_CLIENT_ID: string;
        VITE_HUBSPOT_REDIRECT_URL: string;
    };
}