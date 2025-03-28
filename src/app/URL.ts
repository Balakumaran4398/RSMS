export default class URLs {

    static CURRENT_VERSION(): String {
        return "v7.2.2";
    }

    static AUTH_URL(): String {
        // return 'http://192.168.1.102:8081/api/auth';         //JAYA AKKA    
        // return 'http://192.168.1.115:8081/api/auth';         //BALA
        // return 'http://192.168.1.111:8586/api/auth';         //SUBHA
        return 'http://192.168.70.201:8585/rsms/api/auth';   //QC
        // return 'http://103.183.47.212:8585/rsms/api/auth';      //103

        // return 'http://4kdigital.ridsys.in:8585/rsms/api/auth';   //4k
        // return 'http://cas.ridsys.in:8585/rsms/api/auth';   //AJK
        // return 'http://rdigital.ridsys.in:8585/rsms/api/auth';   //rdigital
    }   

    static BASE_URL(): String { 
        // return "http://192.168.1.102:8081/api";          //JAYA AKKA 
        // return "http://192.168.1.115:8081/api";          //BALA
        // return "http://192.168.1.111:8586/api";          //SUBHA
        return "http://192.168.70.201:8585/rsms/api";    //QC 
        // return "http://103.183.47.212:8585/rsms/api";      //103

        // return "http://4kdigital.ridsys.in:8585/rsms/api";    // 4k
        // return "http://cas.ridsys.in:8585/rsms/api";    // AJK
        // return "http://rdigital.ridsys.in:8585/rsms/api";   //rdigital
    }
}
