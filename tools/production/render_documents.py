"""Render actual local PDFs/CSV exports from the game's English document records."""
import argparse,json,html
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
p=argparse.ArgumentParser();p.add_argument('--data',type=Path,required=True);p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[2]);a=p.parse_args();data=json.loads(a.data.read_text());out=a.root/'assets/documents';out.mkdir(parents=True,exist_ok=True)
def render(name,lines):
 receipt='receipt' in name or 'invoice' in name;width,height=(340,520) if receipt else (595,842);c=canvas.Canvas(str(out/name),pagesize=(width,height));c.setTitle(name);c.setAuthor('The Last Archive / fictional archive');c.setFillColor(HexColor('#e2dbc5'));c.rect(0,0,width,height,fill=1,stroke=0);c.setFillColor(HexColor('#39432f'));c.setFont('Courier',8);c.drawString(30,height-35,'ARCHIVE COPY / ENGLISH RECORD');c.setStrokeColor(HexColor('#8b8167'));c.line(30,height-48,width-30,height-48);y=height-85
 for i,line in enumerate(lines):
  font='Courier-Bold' if i==0 else 'Courier' if receipt or 'log' in name else 'Times-Roman';size=12 if i==0 else 11;c.setFont(font,size)
  for wrapped in simpleSplit(line,font,size,width-60):
   c.drawString(30,y,wrapped);y-=19
  y-=9
 c.setFont('Courier',8);c.setFillColor(HexColor('#8a5b43'));c.drawString(30,40,'READ ONLY / SOURCE CONTENT PRESERVED');c.save()
for f in data['files']:
 if f['n'].endswith('.csv'):(out/f['n']).write_text('\n'.join(f['lines'])+'\n')
 else:render(f['n'],f['lines'])
for m in data['mails']:render(m['att'],m['doc'])
print('Actual document assets:',len(list(out.iterdir())))
