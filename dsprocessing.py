def action(): # pulisci un po il dataset original
    file=open("static/OnlineNewsPopularity.csv", "r") #input file
    out=open("static/dataset.csv", "w")	#output file
    #strip() leva gli spazi attorno alla stringa o leva il char dentro alla funzione stessa
    firstline=file.readline()
    args=firstline.strip().split(",")
    string=""
    string+=args[0].strip()+","+args[3].strip()+","+args[7].strip()+","+args[9].strip()+","+args[10].strip()+",argument,day,numWords,numMedia,"+args[60].strip()+",successful"
    out.write(string+"\n") #write the first line (url,....)
    
    j=0
    count=0
    for line in file:
        args=line.strip().split(",")
        count+=int(args[60].strip())
        j+=1
    count=count/j #pop or not, make average of the shares
    file.close()
    
    file=open("static/OnlineNewsPopularity.csv", "r")
    firstline=file.readline() #skip first line
    
    for line in file:
        args=line.strip().split(",")
        #print(args[32].strip())
        insert=True;

        if args[0]=="": #url
            insert=False
        if int(float(args[3].strip()))==0:# n_tokens_content
            insert=False
        if float(args[3].strip())>5000:
            insert=False
        if float(args[60].strip())>120000:
            insert=False
        if int(float(args[7].strip()))==0:
            insert=False
        if int(float(args[9].strip()))==0:
            insert=False
        if int(float(args[10].strip()))==0:
            insert=False
        
        s=0
        for i in range(31,38): #Day Checking
        	s+=int(float(args[i].strip()))
        if s==0:
            insert=False
        
        s=0
        for i in range(13,19): #Argument Checking
        	s+=int(float(args[i].strip()))
        if s==0:
            insert=False

        if int(float(args[60].strip()))==0:
            insert=False
        if int(float(args[60].strip()))==663600:
            insert=False
        if int(float(args[60].strip()))==298400:
            insert=False
        
        if (insert):
            string=""
            string+=args[0].strip()+","+args[3].strip()+","+args[7].strip()+","+args[9].strip()+","+args[10].strip()+","
            for i in range(13, 19): #argument
            	if int(float(args[i].strip())) != 0:
                	string+=str(i-12)+","
            for i in range(31, 38): #day
            	if int(float(args[i].strip())) != 0:
                	string+=str(i-30)+","
            if float(args[3].strip())<500:
                string+='1,'
            if float(args[3].strip())>=500 and float(args[3].strip())<1000:
                string+='2,'
            if float(args[3].strip())>=1000 and float(args[3].strip())<1500:
                string+='3,'
            if float(args[3].strip())>=1500:
                string+='4,' #stackbar words
            if float(args[7].strip())+float(args[9].strip())+float(args[10].strip()) < 20:
                string+='1,'
            if float(args[7].strip())+float(args[9].strip())+float(args[10].strip()) >= 20 and float(args[7].strip())+float(args[9].strip())+float(args[10].strip()) < 40:
                string+='2,'
            if float(args[7].strip())+float(args[9].strip())+float(args[10].strip()) >= 40 and float(args[7].strip())+float(args[9].strip())+float(args[10].strip()) < 60:
                string+='3,'
            if float(args[7].strip())+float(args[9].strip())+float(args[10].strip()) >= 60:
                string+='4,' #stackbar argument
            string+=args[60].strip()+","
            if(int(args[60].strip()) > count):# 1  popular
                string+="1"
            else:
                string+='0'#0 unpopular
            out.write(string+"\n")

    file.close()
    out.close()
    return 0;

if __name__== "__main__":
    action()
