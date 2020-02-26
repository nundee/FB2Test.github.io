import json

def readCatalogFromText(txtFile):
    with open(txtFile,'rt', encoding='utf-8') as fp:
        hd=[]
        hdRead=False       
        fragen=[]
        frage={}
        for line in fp:
            line=line.strip()
            if len(line)<1:continue
            if line.startswith("Frage "):
                hdRead=True
                if frage:
                    fragen.append(frage)
                frage={'title':line}
                currKey='title'
            elif line[1]==':' and line[0] in 'ABCD':
                currKey=line[0]
            else:
                if hdRead:
                    if currKey in frage:
                        frage[currKey]+= (' ' + line)
                    else:
                        frage[currKey]=line
                else:
                    hd.append(line)
        return dict(header=hd, fragen=fragen)


def mkCat(txtFile, outFile):
    with open(outFile,'wt', encoding='utf-8') as fp:
        json.dump(readCatalogFromText(txtFile),fp)


def filterCat(f, f2,f5,out25):
    with open(f,'rt', encoding='utf-8') as fp:
        df=json.load(fp)
    with open(f2,'rt', encoding='utf-8') as fp:
        df2=json.load(fp)
    with open(f5,'rt', encoding='utf-8') as fp:
        df5=json.load(fp)
    
    def extractQuestion(f):
        return f['title'].split(':')[1].strip()

    allQ = [extractQuestion(f) for f in df['fragen']]
    q2 =   [extractQuestion(f) for f in df2['fragen']]
    q5 = [extractQuestion(f) for f in df5['fragen']]

    def findIdx(q):
        try:
           return allQ.index(q)
        except ValueError as e:
            print(e)
            return -1 

    i25 = [findIdx(q) for q in q2+q5]
    i25 = [i for i in i25 if i>=0]

    def mkQ(k,i):
        q=df['fragen'][i].copy()
        q['title']=f'Frage {k+1}: {allQ[i]}'
        return q

    df25={'fragen': [mkQ(k,i) for (k,i) in enumerate(i25)]}
    
    with open(out25,'wt', encoding='utf-8') as fp:
        json.dump(df25,fp)

if __name__=='__main__':
    #mkCat('Pruefungsformulare-Sammeln-Allgemein-FB2.txt', 'Allgemein.json')
    #mkCat('Pruefungsformulare-Sammeln-Mottor-FB2.txt',    'Motor.json')
    #mkCat('Pruefungsformulare-Sammeln-Segel-FB2.txt',     'Segeln.json')
    #mkCat('katalogmacher2.txt', 'Allgemein2.json')
    #mkCat('katalogmacher2-motor.txt', 'Motor2.json')
    #mkCat('katalogmacher2-segeln.txt', 'Segeln2.json')
    #mkCat('katalogmacher5.txt', 'Allgemein5.json')
    #mkCat('katalogmacher5-motor.txt', 'Motor5.json')
    #mkCat('katalogmacher5-segeln.txt', 'Segeln5.json')

    filterCat('Allgemein.json', 'Allgemein2.json','Allgemein5.json', 'Allgemein25.json')
    filterCat('Motor.json', 'Motor2.json','Motor5.json', 'Motor25.json')
    filterCat('Segeln.json', 'Segeln2.json','Segeln5.json', 'Segeln25.json')
