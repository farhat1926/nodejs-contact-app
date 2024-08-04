const fs = require('fs');
const { stringify } = require('querystring');

const dirPath = './data'
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}
//membuat directory
const dataPath = './data/mahasiswa.json'
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]','utf-8')
}
//ambil semua data di mahasiswa.json
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/mahasiswa.json','utf-8')
    const json = JSON.parse(fileBuffer)
    return json
}


//cari contact berdasarkan nama
const findContact=(nama) =>{
    const kontak = loadContact()
    const contact = kontak.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
    return contact
}
//menuliskan / menimpa data file dengan yang baru
const saveContacts =(contacts) =>{
    fs.writeFileSync('data/mahasiswa.json', JSON.stringify(contacts))
}



// menambahkan data kontak baru
const addContact = (contact) =>{
    const contacts = loadContact()
    contacts.push(contact);
    saveContacts(contacts)
}

// cek nama duplikat
const cekDuplikat =(nama)=>{
    const contacts = loadContact()
    
    return contacts.find((contact) => contact.nama === nama)
}

//hapus kontak
const deleteContact = (nama) =>{
    const contacts = loadContact()
    const filteredContact = contacts.filter((contact=> contact.nama !==nama))
    // console.log(filteredContact)
    saveContacts(filteredContact)
}

// mengubah contak
const updateContact = (contactBaru) => {
    const contacts = loadContact()
    //hilangkan kontak lama yang namanya sama dengan old nama
    const filteredContact = contacts.filter((contact)=> contact.nama !==contactBaru.oldNama)
    delete contactBaru.oldNama
    filteredContact.push(contactBaru)
    saveContacts(filteredContact)
}

module.exports = {loadContact,findContact, addContact, cekDuplikat, deleteContact,updateContact}