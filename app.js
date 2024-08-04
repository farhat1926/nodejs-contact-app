const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const port =2000
const {loadContact, findContact, addContact,cekDuplikat,deleteContact,updateContact} =require('./utils/contacts')
const {body,validationResult,check} = require('express-validator')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


app.set('view engine','ejs')

//middleware third-party
app.use(expressLayout)

//built in  middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

//konfigurasi flash
app.use(cookieParser('secret'));
app.use (
    session({
    cookie:{maxAge:6000},
    secret:'secret',
    resave:true,
    saveUninitialized:true

}));
app.use(flash())


app.get('/', (req,res)=>{
    // res.sendFile('./index.html',{root: __dirname})
    const mahasiswa =[
        {
            nama:'farhat',
            status:'aktif kuliah',
            Hobi:'random',
        },
        {
            nama:'nada',
            status:'aktif kuliah',
            Hobi:'random',
        },
        {
            nama:'ndaru',
            status:'aktif kuliah',
            Hobi:'random',
        }
]
    res.render('index',{nama:'nada', title:'selamat ulang tahun',mahasiswa,layout:'layouts/main-layouts'})
})
app.get('/kontak', (req,res)=>{
    const contacts = loadContact()
    console.log(contacts)
    res.render('kontak',{  
        layout : 'layouts/main-layouts',
        title:'kontak',
        contacts,
        msg:req.flash('msg')
    })
})

//halaman menambahkan data kontak
app.get('/contact/add',(req,res) => {
    res.render('add-contact',{
        title:'menambahkan data',
        layout:'layouts/main-layouts',
    })
})
//proses data kontak 
app.post('/contact',[
    body('nama',).custom((value)=>{
    const duplikat = cekDuplikat(value)
    if(duplikat){
        throw new Error('nama kontak sudah digunakan')
    }
    return true
    }),
    check('email','email tidak valid').isEmail(),
    check('nomer','nomer tidak valid').isMobilePhone('id-ID')
],(req,res) => {
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array()})
        res.render('add-contact',{
            title: 'form tambah data kontak',
            layout:'layouts/main-layouts',
            errors:errors.array()
        })
    }else{
            addContact(req.body)
              // mengirimkan load messege
            req.flash('msg', 'data berhasil dimasukkan')
            res.redirect('/kontak')

    }
    
})
// proses delete kontak
app.get('/contact/delete/:nama',(req,res) => {
    const contact = findContact(req.params.nama)


    //jika kontak tidak ada
    if (!contact){
        res.status(404),
        res.send('<h1>404</h1>')
    }else{
        deleteContact(req.params.nama)
        req.flash('msg', 'data berhasil dihapus')
            res.redirect('/kontak')
    }
})

//halaman mengubah data kontak
app.get('/kontak/edit/:nama',(req,res) => {
    const contact = findContact(req.params.nama)

    res.render('edit-contact',{
        title:'mengubah data kontak',
        layout:'layouts/main-layouts',
        contact,
    })
})

//proses ubah data
app.post('/kontak/update',[
    body('nama').custom((value,{ req })=>{
    const duplikat = cekDuplikat(value)
    if(value !== req.body.oldNama && duplikat){
        throw new Error('nama kontak sudah digunakan')
    }
    return true
    }),
    check('email','email tidak valid').isEmail(),
    check('nomer','nomer tidak valid').isMobilePhone('id-ID')
],(req,res) => {
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array()})
        res.render('edit-contact',{
            title: 'form ubah data kontak',
            layout:'layouts/main-layouts',
            errors:errors.array(),
            contact: req.body,
        })
    }else{
            updateContact(req.body)
              // mengirimkan load messege
            req.flash('msg', 'data berhasil diubah')
            res.redirect('/kontak')

    }
    
})


//halaman detail contact
app.get('/contact/:nama', (req,res)=>{
    const contact = findContact(req.params.nama)

    res.render('detail',{  
        title:'halaman detail kontak',
        layout : 'layouts/main-layouts',
        contact
    })
})
app.get('/about', (req,res)=>{
    res.render('about',{ layout : 'layouts/main-layouts',title:'about'})
})
app.get('/index', (req,res)=>{
    res.render('about',{ layout : 'layouts/main-layouts',title:'about'})
})

app.listen(port,() => {
    console.log(`example app listening at http://localhost:${port}`)
})

