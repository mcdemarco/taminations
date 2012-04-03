
import glob
import re

def main():
  #  Build table of calls in each file
  r = re.compile('title="(.*?)"')
  t = {}
  for filename in glob.glob('*/*.xml'):
    filename = filename.replace('\\','/')
    t[filename] = []
    for line in open(filename):
      m = r.search(line)
      if m:
        t[filename].append(m.group(1))
  #  Invert the table
  it = {}
  for c in t.values():
    for cc in c:
      it[cc] = set()
  for f in t:
    for c in t[f]:
      it[c].add(f)
  #  Now print the file(s) for each call in JSON format
  print('{')
  for c in it:
    print('    "'+c+'":["'+'","'.join(it[c])+'"],')
  print('    "--":[]')
  print('}')

main()
