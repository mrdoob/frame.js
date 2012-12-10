import os

source = '../src/Frame.js'
output = '../build/frame.min.js'

os.system('java -jar compiler/compiler.jar --language_in=ECMASCRIPT5 --js ' + source + ' --js_output_file ' + output)

with open(output,'r') as f: text = f.read()
with open(output,'w') as f: f.write("// frame.js - http://github.com/mrdoob/frame.js\n" + text)
