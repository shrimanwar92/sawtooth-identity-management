import sys, json
from ecies import encrypt, decrypt
from coincurve import PrivateKey, PublicKey

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def encrypt_data(publicKey, data):
    enc = encrypt(publicKey, bytearray(json.dumps(data), 'utf-8'))
    print(enc)

def decrypt_data(privateKey, enc_data):
    dec = decrypt(privateKey, bytearray(json.dumps(enc_data), 'utf-8'))
    print(dec)

def main():
    #get our data as an array from read_in()
    data = read_in()

    action = data.get('action')
    if action == 'encrypt':
        publicKey = PublicKey(data.get('publicKey'))
        print(publicKey.format(False).hex())
        encrypt_data(publicKey, data.get('payload'))
    elif action == 'decrypt':
        privateKey = PrivateKey(data.get('privateKey'))
        decrypt_data(privateKey, data.get('payload'))
    

    # data = b'this is a test'
    # enc = encrypt(publicKey, data)
    # dec = decrypt(privateKey, enc)
    # print(enc.decode('utf-8'))

#start process
if __name__ == '__main__':
    main()