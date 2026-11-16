const {JSDOM}=require("jsdom"),fs=require("fs"),d=__dirname+"/";
const w=new JSDOM(fs.readFileSync(d+"index.html","utf8").replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>"<script>"+fs.readFileSync(d+f,"utf8")+"</script>"),{runScripts:"dangerously",url:"http://localhost/"}).window;
w.eval("S.unlocked=true;maps()");const g=[...w.document.querySelectorAll("#mp g")].find(x=>x.textContent.includes("Hotel"));g.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
console.log(w.eval("selP"),w.eval("S.flags.includes('place:hotel')")?"PASS flag via tap":"FAIL");
