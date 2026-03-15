import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabaseUrl = "https://kdyslerhrrjxidvkbutu.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkeXNsZXJocnJqeGlkdmtidXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDgyNzMsImV4cCI6MjA4OTA4NDI3M30.CZzZVgYNwoyMCw9jpKJKQr-EJN0ay3EtwNhx1vJBqao";

const supabase = createClient(supabaseUrl, supabaseAnonKey);


window.onload = async function () {
  try{
    const { data, error } = await supabase .from("message") .select("*")    
    let view =  await data[0].viewed;
    if (view == true) {
    window.location.href = "/404.html";
  } else {
    view = true;
    await supabase.from("message").update({ viewed: true }).eq("id", 1).select();
    this.document.write("<h1>hi this is aashir</h1>");
    this.setTimeout(() => {
      window.location.href = "/404.html";
    }, 60000);
  }
  }
  catch(err){
    console.log(err);
  }
};
