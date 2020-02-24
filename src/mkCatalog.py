def readCatalogFromText(txtFile):
    with open(txtFile,'rt', encoding='utf8') as fp:
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
                currKey='text'
            elif line[1]==':' and line[0] in 'ABCD':
                currKey=line[0]
            else:
                if hdRead:
                    if currKey in frage:
                        frage[currKey]+=line
                    else:
                        frage[currKey]=line
                else:
                    hd.append(line)
        
        for f in fragen:
            titles=[s.strip() for s in f['title'].split(':')]
            f['title']=titles[0]
            if len(titles)>1 and titles[1]:
                if 'text' in f:
                    f['text']=titles[1] + ' ' + f['text']
                else:
                    f['text']=titles[1]
    return dict(header=hd, fragen=fragen)


if __name__=='__main__':
    import sys, json, pprint
    fname=sys.argv[1] if len(sys.argv)>1 else 'Pruefungsformulare-Sammeln-Allgemein-FB2.txt'
    dd=readCatalogFromText(fname)
    print(json.dumps(dd))


