"""Render original building plans and differentiated records locally. No paid renderer or model."""
from pathlib import Path
import json,subprocess
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
root=Path(__file__).resolve().parents[2]
code="const fs=require('fs'),vm=require('vm'),c={};vm.runInNewContext(fs.readFileSync('edition.js','utf8')+';globalThis.data=STORY',c);process.stdout.write(JSON.stringify(c.data.files));"
files=json.loads(subprocess.check_output(['node','-e',code],cwd=root));out=root/'assets/documents'
for f in files:
 if f['id'] not in ['C11','C32','S02','C46','C47']:continue
 plan=f['id'] in ['C46','C47'];receipt=f['id']=='C11';personal=f['id']=='S02';w,h=(842,595) if plan else (360,700) if receipt else (595,842)
 c=canvas.Canvas(str(out/f['n']),pagesize=(w,h));c.setTitle(f['title']);bg='#dce0cd' if plan else '#eee4ca' if receipt else '#ddcdab' if personal else '#e6e3d6';c.setFillColor(HexColor(bg));c.rect(0,0,w,h,fill=1,stroke=0)
 if personal:
  c.setStrokeColor(HexColor('#b3a079'));c.setLineWidth(.35)
  for y in range(60,int(h)-80,28):c.line(35,y,w-35,y)
  c.setStrokeColor(HexColor('#a77554'));c.line(60,50,60,h-50)
 elif not receipt:
  c.setStrokeColor(HexColor('#5d7359'));c.setLineWidth(2);c.rect(25,25,w-50,h-50);c.setLineWidth(.5);c.rect(30,30,w-60,h-60)
 c.setFillColor(HexColor('#344632'));c.setFont('Courier',8);c.drawString(40,h-45,'RETAINED SOURCE / ENGLISH / '+f['id']);y=h-85
 if plan:
  c.setFont('Courier-Bold',16);c.drawString(40,y,f['lines'][0]);c.setFont('Courier',9);c.drawString(40,y-22,f['lines'][1]);c.saveState();c.translate(25,210);c.scale(.9,.9)
  def line(points):
   p=c.beginPath();p.moveTo(points[0][0],360-points[0][1])
   for x,z in points[1:]:p.lineTo(x,360-z)
   c.drawPath(p)
  c.setStrokeColor(HexColor('#a3ae93'));c.setLineWidth(.3)
  for x in range(30,571,20):line([(x,35),(x,290)])
  for z in range(35,291,20):line([(30,z),(570,z)])
  c.setStrokeColor(HexColor('#354e38'));c.setLineWidth(3)
  for pts in [[(30,35),(570,35),(570,290),(30,290),(30,35)],[(180,35),(180,75)],[(180,115),(180,180)],[(180,224),(180,290)],[(180,160),(270,160)],[(310,160),(400,160)],[(400,35),(400,75)],[(400,115),(400,180)],[(400,224),(400,290)]]:line(pts)
  if f['id']=='C46':line([(400,180),(400,224)])
  else:c.setLineWidth(1);line([(400,180),(444,180),(400,224)])
  c.setFillColor(HexColor('#c0b99d'));p=c.beginPath();p.moveTo(290,305);p.lineTo(190,215);p.lineTo(390,215);p.close();c.drawPath(p,fill=1,stroke=0);c.setFillColor(HexColor('#354e38'));c.setFont('Courier',12)
  for x,z,t in [(45,245,'ENTRANCE'),(240,105,'HALL / CAM'),(210,260,'SERVICE PASSAGE'),(460,260,'STAIRS'),(450,52,'N ^')]:c.drawString(x,360-z,t)
  if f['id']=='C47':c.drawString(435,145,'S2')
  line([(455,315),(535,315)]);c.setFont('Courier',9);c.drawString(455,20,'2 METRES');c.restoreState();y=180;lines=f['lines'][2:]
 else:lines=f['lines']
 for i,text in enumerate(lines):
  font='Courier-Bold' if i==0 and receipt else 'Courier' if receipt else 'Times-Italic' if personal else 'Times-Bold' if i==0 else 'Times-Roman';size=12 if receipt else 16 if personal else 13 if i==0 else 11;left=75 if personal else 40
  c.setFont(font,size)
  for part in simpleSplit(text,font,size,w-left-40):
   if y<60:c.showPage();c.setFillColor(HexColor(bg));c.rect(0,0,w,h,fill=1,stroke=0);c.setFillColor(HexColor('#344632'));c.setFont(font,size);y=h-60
   c.drawString(left,y,part);y-=19 if personal else 17
  y-=14 if receipt else 12
 if receipt:
  c.setDash(2,4);c.setStrokeColor(HexColor('#7b7155'));c.line(30,35,w-30,35)
 c.setFont('Courier',7);c.drawString(40,20,'ARCHIVE COPY / ORIGINAL WORDING PRESERVED');c.save()
print('Rendered five original plan/personal/receipt/report records.')
