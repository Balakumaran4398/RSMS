export default class URLs {
    static CURRENT_VERSION(): String {
        return "v7.2.2";
    }

    static AUTH_URL(): String {
        const host = window.location.hostname;
     
        // return 'http://192.168.1.102:8585/api/auth';               //JAYA AKKA    
        // return 'http://192.168.1.112:8585/api/auth';               //BALA
        // return 'http://192.168.1.111:8585/api/auth';               //SUBHA
        return 'http://192.168.70.201:8989/rsms/api/auth';            //QC    
        // return 'http://103.183.47.212:8585/rsms/api/auth';         //103

        // return `http://${host}:8989/rsms/api/auth`;                // HOST      
        // return 'http://4kdigital.ridsys.in:8585/rsms/api/auth';    //4k
        // return 'https://cas.ridsys.in:8585/rsms/api/auth';         //AJK
        // return 'http://rdigital.ridsys.in:8585/rsms/api/auth';     //rdigital  
        // return 'http://deenet.ridsys.in:8585/rsms/api/auth';       // deenet
        // return 'http://192.168.0.39:8585/rsms/api/auth';           // siddeshwar
        // return 'http://scnafz.ridsys.in:8585/rsms/api/auth';       // siddeshwar
    }
    
    static BASE_URL(): String {
        const host = window.location.hostname;

        // return "http://192.168.1.102:8585/api";                   //JAYA AKKA 
        // return "http://192.168.1.112:8585/api";                   //BALA
        // return "http://192.168.1.111:8585/api";                   //SUBHA
        return "http://192.168.70.201:8989/rsms/api";                //QC
        // return "http://103.183.47.212:8585/rsms/api";             //103
        
        // return `http://${host}:8989/rsms/api`;                    // HOST
        // return "http://4kdigital.ridsys.in:8585/rsms/api";        // 4k
        // return "https://cas.ridsys.in:8585/rsms/api";             // AJK
        // return "http://rdigital.ridsys.in:8585/rsms/api";         //rdigital
        // return "http://deenet.ridsys.in:8585/rsms/api";           //deenet
        // return "http://192.168.0.39:8585/rsms/api";               // siddeshwar
        // return "http://192.168.0.39:8585/rsms/api";               // siddeshwar
        // return "http://scnafz.ridsys.in:8585/rsms/api";           // siddeshwar
    }
}
