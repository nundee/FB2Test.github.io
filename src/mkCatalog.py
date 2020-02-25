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
        
        # for f in fragen:
        #     titles=[s.strip() for s in f['title'].split(':')]
        #     f['title']=titles[0]
        #     if len(titles)>1 and titles[1]:
        #         if 'text' in f:
        #             f['text']=titles[1] + ' ' + f['text']
        #         else:
        #             f['text']=titles[1]
    return dict(header=hd, fragen=fragen)


def mkCat(txtFile, outFile):
    with open(outFile,'wt', encoding='utf-8') as fp:
        json.dump(readCatalogFromText(txtFile),fp)


if __name__=='__main__':
    mkCat('Pruefungsformulare-Sammeln-Allgemein-FB2.txt', 'Allgemein.json')
    mkCat('Pruefungsformulare-Sammeln-Mottor-FB2.txt',    'Motor.json')
    mkCat('Pruefungsformulare-Sammeln-Segel-FB2.txt',     'Segeln.json')


