const Post = require("../model/Post");
//Post Seeder bu modulü ../model/db.js içerisinde kullandım
module.exports = async()=>{
    await Post.insertMany([
        {
            title: "Nodejs Blog Projesi",
            body: "Net ninja ile blog projesi deneme."
        },
        {
            title: "Veri Tabanı Yönetim Sistemleri Projesi",
            body: "Ülkedeki potansiyel su oranları, sulama vb durumlar için harcanan su ile kuraklık değerlerinin karşılaştırılması"
        },
        {
            title: "Yazılım Tasarım Mimarisi Projesi",
            body: "Hastane sistemine entegreli çalışan acil kan uyarı mesajı projesi."
        },
    ]);
};