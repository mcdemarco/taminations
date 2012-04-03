
#    Copyright 2009 Brad Christie
#
#    This file is part of TAMinations.
#
#    TAMinations is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as published
#    by the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    TAMinations is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with TAMinations.  If not, see <http://www.gnu.org/licenses/>.


# This makefile builds the JAR file needed to load taminations by the Java applet
# and the zip file that's available for download

.phony : all
all : TAMination.jar tamination.zip callindex.json
	@echo Build complete

unzip :
	cd ext/jquery && jar xvf jquery.mobile-1.0.1.zip
	cd ext/jquery/jquery.mousewheel && jar xvf jquery.mousewheel.3.0.2.zip
	cd ext/jquery/jquery.svg && jar xvf jquery.svg.package-1.4.4.zip
	cd ext/jquery/jquery.ui && jar xvf jquery-ui-1.8.18.custom.zip

#  Clean target to delete jar and zip
.phony : clean
clean :
	-del tamination.zip
	-del *.class *.jar

#  Make the JAR file.  Tell the compiler to compile for Java 1.3 for maximum compatibility
TAMination.jar : TAMination.java
	javac -source 1.3 -target 1.3 -classpath c:\programs\java\jre6\lib\plugin.jar TAMination.java && jar -cf TAMination.jar *.class

#  Make the zip file.  Exclude my Eclipse project files which are not of interest to others.
tamination.zip : $(filter-out tamination.zip,$(wildcard * */*))
	-del tamination.zip
	cd .. && c:\cygwin17\bin\zip -q -r tamination/tamination.zip tamination -x */.* */.*/* */.*/

#  Make the index of calls
callindex.json : $(wildcard */*.xml)
	python indexcalls.py >$@
