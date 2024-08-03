import arcpy
import os

outFolder = r"E:\agsmaps\PER"
outGDBName = "DMSM_PER.gdb"
outPath = os.path.join(outFolder,outGDBName)

#Checking id DMSM_PER.gdb exists, if not createas a new gdb
if arcpy.Exists(outPath) == True:
    print("GDB Already Exists")

else:
    print("Creating Output GDB")
    arcpy.CreateFileGDB_management(outFolder,outGDBName)

#Sets SDE Connection and workspace to SDE
sde_connection = r"E:\agsmaps\connections_databases\DMSM2024@DMSM_Reader@FSXSNPF0188.sde"

arcpy.env.workspace = sde_connection

DamageAreasView = "DMSM_EDITOR.DAMAGE_AREAS"
DamagePointsView = "DMSM_EDITOR.DAMAGE_POINTS"


#Copies Damage Areas and Damage Points from DMSM DB to GDB
print("Copying Damage Areas and Points to GDB")
arcpy.conversion.ExportFeatures(
    in_features=DamageAreasView,
    out_features=r"E:\agsmaps\PER\DMSM_PER.gdb\DamageAreasJoinTable",
    where_clause="",
    use_field_alias_as_name="NOT_USE_ALIAS"
)

arcpy.conversion.ExportFeatures(
    in_features=DamagePointsView,
    out_features=r"E:\agsmaps\PER\DMSM_PER.gdb\DamagePointsJoinTable",
    where_clause="",
    use_field_alias_as_name="NOT_USE_ALIAS"
)

ObservationsTable = "DMSM_EDITOR.OBSERVATIONS"
HostsTable = "DMSM_EDITOR.HOSTS"
DCATable="DMSM_EDITOR.DAMAGE_CAUSING_AGENTS"
DamageTypesTable="DMSM_EDITOR.DAMAGE_TYPES"
PercentAffectedTable="DMSM_EDITOR.PERCENT_AFFECTED"
HostGroupTable="DMSM_EDITOR.HOST_GROUPS"
NumOfTreesTable="DMSM_EDITOR.NUMBER_OF_TREES"

#Copies Reference Tables to GDB
print("Copying Reference Tables to GDB")
arcpy.management.CopyRows(ObservationsTable,r"E:\agsmaps\PER\DMSM_PER.gdb\ObservationsRef")
arcpy.management.CopyRows(HostsTable,r"E:\agsmaps\PER\DMSM_PER.gdb\HostsRef")
arcpy.management.CopyRows(DCATable,r"E:\agsmaps\PER\DMSM_PER.gdb\DCARef")
arcpy.management.CopyRows(DamageTypesTable,r"E:\agsmaps\PER\DMSM_PER.gdb\DamageTypesRef")
arcpy.management.CopyRows(PercentAffectedTable,r"E:\agsmaps\PER\DMSM_PER.gdb\PercentAffectedRef")
arcpy.management.CopyRows(HostGroupTable,r"E:\agsmaps\PER\DMSM_PER.gdb\HostGroupsRef")
arcpy.management.CopyRows(NumOfTreesTable,r"E:\agsmaps\PER\DMSM_PER.gdb\NumTreesRef")

#Changes Workspace to DMSM_PER GDB
arcpy.env.workspace = outPath

#Add Joins to Damage Area and Damage Points tables
print("Creating Joins for Points and Polygons tables")
arcpy.management.AddJoin("DamageAreasJoinTable","DAMAGE_AREA_ID","ObservationsRef","DAMAGE_AREA_ID")
arcpy.management.AddJoin("DamageAreasJoinTable","HOST_CODE","HostsRef","CODE")
arcpy.management.AddJoin("DamageAreasJoinTable","DAMAGE_TYPE_CODE","DamageTypesRef","DAMAGE_TYPE_CODE")
arcpy.management.AddJoin("DamageAreasJoinTable","DCA_CODE","DCARef","CODE")
arcpy.management.AddJoin("DamageAreasJoinTable","PERCENT_AFFECTED_CODE","PercentAffectedRef","PERCENT_AFFECTED_CODE")
arcpy.management.AddJoin("DamageAreasJoinTable","HOST_GROUP_CODE","HostGroupsRef","HOST_GROUP_CODE")



arcpy.management.AddJoin("DamagePointsJoinTable","DAMAGE_POINT_ID","ObservationsRef","DAMAGE_POINT_ID")
arcpy.management.AddJoin("DamagePointsJoinTable","HOST_CODE","HostsRef","CODE")
arcpy.management.AddJoin("DamagePointsJoinTable","DAMAGE_TYPE_CODE","DamageTypesRef","DAMAGE_TYPE_CODE")
arcpy.management.AddJoin("DamagePointsJoinTable","DCA_CODE","DCARef","CODE")
arcpy.management.AddJoin("DamagePointsJoinTable","NUMBER_OF_TREES","NumTreesRef","NUMBER_OF_TREES_CODE")

#Exports New Feature Classes to trim unwanted fields
print("Creating Join Tables")
arcpy.conversion.ExportFeatures(
    in_features="DamageAreasJoinTable",
    out_features=r"E:\agsmaps\PER\DMSM_PER.gdb\DamageAreasMerge",
    where_clause="",
    use_field_alias_as_name="NOT_USE_ALIAS",
    field_mapping='CREATED_DATE "CREATED_DATE" true true false 8 Date 0 0,First,#,DamageAreasJoinTable,DamageAreasJoinTable.CREATED_DATE,-1,-1;MODIFIED_DATE "MODIFIED_DATE" true true false 8 Date 0 0,First,#,DamageAreasJoinTable,DamageAreasJoinTable.MODIFIED_DATE,-1,-1;COMMON_NAME "DCA_COMMON_NAME" true true false 100 Text 0 0,First,#,DamageAreasJoinTable,DCARef.COMMON_NAME,0,100;NAME "DAMAGE_TYPE_NAME" true true false 50 Text 0 0,First,#,DamageAreasJoinTable,DamageTypesRef.NAME,0,50;COMMON_NAME "HOST_COMMON_NAME" true true false 100 Text 0 0,First,#,DamageAreasJoinTable,HostsRef.COMMON_NAME,0,100;NAME "HOST_GROUP_MEMBERS" true true false 50 Text 0 0,First,#,DamageAreasJoinTable,HostGroupsRef.NAME,0,50;NAME "PERCENT_AFFECTED_RANGE" true true false 50 Text 0 0,First,#,DamageAreasJoinTable,PercentAffectedRef.NAME,0,50;DAMAGE_AREA_ID "DAMAGE_AREA_ID" true true false 50 Text 0 0,First,#,DamageAreasJoinTable,DamageAreasJoinTable.DAMAGE_AREA_ID,0,50'
)

arcpy.conversion.ExportFeatures(
    in_features="DamagePointsJoinTable",
    out_features=r"E:\agsmaps\PER\DMSM_PER.gdb\DamagePoints",
    where_clause="",
    use_field_alias_as_name="NOT_USE_ALIAS",
    field_mapping='CREATED_DATE "CREATED_DATE" true true false 8 Date 0 0,First,#,DamagePointsJoinTable,DamagePointsJoinTable.CREATED_DATE,-1,-1;MODIFIED_DATE "MODIFIED_DATE" true true false 8 Date 0 0,First,#,DamagePointsJoinTable,DamagePointsJoinTable.MODIFIED_DATE,-1,-1;COMMON_NAME "DCA_COMMON_NAME" true true false 100 Text 0 0,First,#,DamagePointsJoinTable,DCARef.COMMON_NAME,0,100;NAME "DAMAGE_TYPE_NAME" true true false 50 Text 0 0,First,#,DamagePointsJoinTable,DamageTypesRef.NAME,0,50;COMMON_NAME "HOST_COMMON_NAME" true true false 100 Text 0 0,First,#,DamagePointsJoinTable,HostsRef.COMMON_NAME,0,100;NAME "HOST_GROUP_MEMBERS" true true false 50 Text 0 0,First,#,DamagePointsJoinTable,HostGroupsRef.NAME,0,50;COUNT_RANGE "NUMBER_OF_TREES" true true false 10 Text 0 0,First,#,DamagePointsJoinTable,NumTreesRef.COUNT_RANGE,0,10;DAMAGE_POINT_ID "DAMAGE_POINT_ID" true true false 50 Text 0 0,First,#,DamagePointsJoinTable,DamagePointsJoinTable.DAMAGE_POINT_ID,0,50'
)

#Buffers Points By 10ft, converting to Polygons
print("Converting Points to Polygons")
arcpy.analysis.Buffer(
    in_features="DamagePoints",
    out_feature_class=r"E:\agsmaps\PER\DMSM_PER.gdb\DamagePointsBuffer",
    buffer_distance_or_field="10 Feet",
    line_side="FULL",
    line_end_type="ROUND",
    dissolve_option="NONE",
    dissolve_field=None,
    method="PLANAR"
)

#Merges Points and Polygons into one layer named DMSM Data
arcpy.management.Merge(
    inputs="DamageAreasMerge;DamagePointsBuffer",
    output=r"E:\agsmaps\PER\DMSM_PER.gdb\DMSM_Data",
    field_mappings='CREATED_DATE "CREATED_DATE" true true false 8 Date 0 0,First,#,DamageAreasMerge,CREATED_DATE,-1,-1,DamagePointsBuffer,CREATED_DATE,-1,-1;MODIFIED_DATE "MODIFIED_DATE" true true false 8 Date 0 0,First,#,DamageAreasMerge,MODIFIED_DATE,-1,-1,DamagePointsBuffer,MODIFIED_DATE,-1,-1;COMMON_NAME "DCA_COMMON_NAME" true true false 100 Text 0 0,First,#,DamageAreasMerge,COMMON_NAME,0,100,DamagePointsBuffer,COMMON_NAME,0,100;NAME "DAMAGE_TYPE_NAME" true true false 50 Text 0 0,First,#,DamageAreasMerge,NAME,0,50,DamagePointsBuffer,NAME,0,50;COMMON_NAME_1 "HOST_COMMON_NAME" true true false 100 Text 0 0,First,#,DamageAreasMerge,COMMON_NAME_1,0,100,DamagePointsBuffer,COMMON_NAME_1,0,100;NAME_1 "HOST_GROUP_MEMBERS" true true false 50 Text 0 0,First,#,DamageAreasMerge,NAME_1,0,50,DamagePointsBuffer,NAME_1,0,50;NAME_12 "PERCENT_AFFECTED_RANGE" true true false 50 Text 0 0,First,#,DamageAreasMerge,NAME_12,0,50;Shape_Length "Shape_Length" false true true 8 Double 0 0,First,#,DamageAreasMerge,Shape_Length,-1,-1,DamagePointsBuffer,Shape_Length,-1,-1;Shape_Area "Shape_Area" false true true 8 Double 0 0,First,#,DamageAreasMerge,Shape_Area,-1,-1,DamagePointsBuffer,Shape_Area,-1,-1;COUNT_RANGE "NUMBER_OF_TREES" true true false 10 Text 0 0,First,#,DamagePointsBuffer,COUNT_RANGE,0,10;DAMAGE_AREA_ID "DAMAGE_AREA_ID" true true false 50 Text 0 0,First,#,DamageAreasMerge,DAMAGE_AREA_ID,0,50;DAMAGE_POINT_ID "DAMAGE_POINT_ID" true true false 50 Text 0 0,First,#,DamagePointsBuffer,DAMAGE_POINT_ID,0,50',
    add_source="NO_SOURCE_INFO"
)

#Checks if Survey Year has already been added to DMSM_Data, if not creates field and puts in Survey Year
#Year will need to be changed each year within for loop
field_list = [field.name for field in arcpy.ListFields("DMSM_Data")]

if 'SURVEY_YEAR' in field_list:
    print("Survey Year already added")
else:
    print("Adding Survey Year to Feature Class")
    arcpy.management.AddField("DMSM_Data","SURVEY_YEAR","SHORT")
    with arcpy.da.UpdateCursor("DMSM_Data",["SURVEY_YEAR"]) as cursor:
        for row in cursor:
            row[0] = 2024
            cursor.updateRow(row)


#Create Unique ID Field and Populates with Damage Id's + Survey Year

arcpy.management.AddField("DMSM_Data","UNIQUE_ID","TEXT",75)
arcpy.management.CalculateField(
    in_table="DMSM_Data",
    field="UNIQUE_ID",
    expression="getID(!DAMAGE_AREA_ID!,!DAMAGE_POINT_ID!,str(!SURVEY_YEAR!))",
    expression_type="PYTHON3",
    code_block="""def getID(area,point,year):
    if area != None:
        return area + year
    if point != None:
        return point + year""",
    field_type="TEXT",
    enforce_domains="NO_ENFORCE_DOMAINS"
)


#Check for Dmage Area ID or Damage Point Id
#If found don't append to all years -- if not found append to all years

damage_IDs = []
with arcpy.da.SearchCursor("DMSM_Damage_Allyears",["DAMAGE_AREA_ID","DAMAGE_POINT_ID", "SURVEY_YEAR"]) as cursor:
    for row in cursor:
        value = row[0]
        value2 = row[1]
        val3 = row[2]
        if value != None:
            damage_IDs.append(value + str(val3))
        if value2 != None:
            damage_IDs.append(value2 + str(val3))


#Delete Features that already exist from DMSM_Data
expression = "{} IN ('{}')".format(arcpy.AddFieldDelimiters("DMSM_Data","UNIQUe_ID"),"','".join(damage_IDs))


arcpy.management.SelectLayerByAttribute("DMSM_Data","NEW_SELECTION",expression)
if int(arcpy.management.GetCount("DMSM_Data")[0]) > 0:
    arcpy.management.DeleteFeatures("DMSM_Data")

#Appends what's left from DMSM Data to DMSM Damage AllYears
arcpy.management.Append(
    inputs="DMSM_Data",
    target="DMSM_Damage_Allyears",
    schema_type="TEST",
    field_mapping=None,
    subtype="",
    expression="",
    match_fields=None,
    update_geometry="NOT_UPDATE_GEOMETRY"
)

featureCount = arcpy.management.GetCount("DMSM_Damage_Allyears")
DMSMCount = int(featureCount.getOutput(0))

print("Number of Features Added: ", DMSMCount)

#Deletes Reference and Extra Layers
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\DamageAreasJoinTable")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\DamagePointsJoinTable")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\DamagePoints")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\DamagePointsBuffer")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\DMSM_Data")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\DamageAreasMerge")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\DamageTypesRef")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\DCARef")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\HostGroupsRef")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\HostsRef")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\ObservationsRef")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\PercentAffectedRef")
arcpy.management.Delete(r"E:\agsmaps\PER\DMSM_PER.gdb\NumTreesRef")