# sawtooth-identity-management

Project Name: customer E-KYC Task: To securely encrypt the customer KYC data, read-only access to the stakeholders, updation can only be done by customer 
1) Upon signup, each customer and stakeholder would get a public-private key pair. Customer and stakeholder can share his public key but private key has to be kept secret. Sharing private key may compromise the data. 

2) Customer data consisted of many fields and some confidential information. When the customer data is saved, following tasks are done, 
    
    a) Generating a md5 hash password using customer information like first name, last name, dob, age, email and some secret. (md5 is One way hash function) 
    
    b) Using the generated md5 hash password, encrypt the customer data using symmetric encryption(AES). (Symmetric encryption is a type of encryption where only one key (a secret key or in our case md5 hash password) is used to both encrypt and decrypt electronic information). 
    
    c) Using the customer public key, encrypt the md5 hash password using asymmetric encryption ECIES (Elleptic curve integrated encryption scheme). Now only customer has the ability to decrypt the md5 hash password using his private key. 
    
    d) Since all the customer data is encryped, it cannot be accessed by any stakeholders, as the private key used to decrypt md5 hash password lies with customer. 
    
    e) If any stakeholder requests read only access to data, then the stakeholder sends a request to customer to access his data. Upon receiving the request, the customer decrypts the md5 hash password using his private key. 
    
    f) The decrypted md5 hash password is then encrypted with the stakeholders public key. 
    
    g) The stakeholder uses his private key to decrypt the md5 hash password. 
    
    h) The decrypted md5 hash password and encrypted customer data is fed to symmetric algorithm which returns decrypted customer data. 
    
3) We are not sending the customer data directly instead we are sending md5 hash password encrypted with the stakeholder public key, so that only that stakeholder which has the private key corresponding to that public key can decrypt the customer data. Since public keys are derived from private keys, no other stakeholder can decrypt the data. 

4) Update on customer data can only be done by the customer itself as the updation request is signed by customer private key. Stakeholder sending update request on customer data gets failed as the customer private key signature does not match with stakeholder private key signature. 

5) To revoke access to the stakeholder, we simply delete the customer password from 
stakeholders access list. 
