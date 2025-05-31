import re
import sys
import tempfile
import shutil
import os

filename = sys.argv[1]
tmp_file = tempfile.NamedTemporaryFile(mode='w+t', delete=False)
for line in open(filename).readlines():
    tmp_file.write(re.sub('_(.)', lambda x: x.group(1).upper(), line))
tmp_file.close()
shutil.move(tmp_file.name, filename)
