const API_BASE = "http://localhost:8888";

export function API(){
    this.GetData = async () => {
        let response = await fetch(API_BASE + "/GetData");
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const recv = await response.json();
        console.log(recv);
        /*
        const dummy = [{
            name: "good man",
            src: "video/good man.mp4",
            thumnail: "video/good man/thum1.png",
            type: "mp4"
        },
        {
            name: "good man 2",
            src: "video/good man 2.mp4",
            thumnail: "video/good man 2/thum1.png",
            type: "mp4"
        }];
        */
        return recv;
    }
}