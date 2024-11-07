export default class URLs {

    static CURRENT_VERSION(): String {
        return "v7.0";
    }

    static AUTH_URL(): String {
        return 'http://192.168.1.102:8081/api/auth';   //JAYA AKKA
        // return 'http://192.168.1.115:8081/api/auth';     //BALA
        // return 'http://192.168.70.201:8585/rsms/api/auth';   //QC
    }

    static BASE_URL(): String {
        return "http://192.168.1.102:8081/api";     //JAYA AKKA 
        // return "http://192.168.1.115:8081/api";       //BALA
        // return "http://192.168.70.201:8585/rsms/api";    //QC
    }

}