<?php

abstract class Table
{
  protected $tableName;
  protected $primaryKey = "id";
  private $fields;

  public function __construct()
  {
    if (!empty($this->tableName))
      $this->detectFields();
    else
      die('Table: table name is required');
  }

  public function __set($attr,$val)
  {
    $class = get_called_class();
    $ob_attr = substr(str_replace("_id","",$attr),0,-1);

    if($attr == "character" && gettype($val) != "object" && get_class($val) == "Character")
    {
      throw new Exception($attr.' need to be Character Object'); die("coucou");
    }

    //gestion fk
    if(property_exists($class,$attr) && array_key_exists($attr,$this->fields))
    {
      $this->$attr = $val;
    }
    elseif(property_exists($class,$ob_attr) && array_key_exists($attr,$this->fields))
    {
      $fk_class = ucfirst($ob_attr);
      $ob_attr = strtolower($fk_class);

      if($fk_class == "Character")
      {
        $q="SELECT class FROM characters WHERE id=".myEscape($val);
        $data = myFetchAssoc($q);
        $data = $data[0];
        $object = new $data['class']();
        $object->setId($val);
        $object->hydrate();
      }
      else
      {
        $object = $fk_class::find($val);
      }
      $this->$ob_attr = $object;
    }

  }

  public function __get($attr)
  {
    $class = get_called_class();
    $getter = "get".ucfirst($attr);

    if(property_exists($class,$attr))
      return $this->$attr;

    if($getter == "getClass")
      return $this->$getter();

  }

  private function detectFields()
  {
    $data = myFetchAssoc("SHOW COLUMNS FROM `".$this->tableName."`");

    foreach($data AS $field)
    {
      $this->fields[$field['Field']] = $field;

      if($field['Key'] == 'PRI')
      {
        $this->primaryKey = $field['Field'];
      }
    }
  }

  static public function find($id)
  {
    $class = get_called_class();

    if(!property_exists($class,"bddTable"))
      $table_name = strtolower($class."s");
    else
      $table_name = $class::$bddTable;

    $q = "SELECT id FROM `$table_name` WHERE `id` = ".intval($id);
    $data = myFetchAssoc($q);

    if(count($data) == 0)
      return;

    $object = new $class();
    $object->id = $id;
    $object->hydrate();

    return $object;
  }

  static public function all()
  {
    $class = get_called_class();

    if(!property_exists($class,"bddTable"))
      $table_name = strtolower($class."s");
    else
      $table_name = $class::$bddTable;

    $q = "SELECT id FROM `$table_name`";
    $data = myFetchAssoc($q);

    if(count($data) == 0)
      return;

    $all = array();
    foreach($data as $row)
    {
      $object = $class::find($row['id']);
      $all[] = $object;
    }

    return $all;
  }

  public function manyToMany($table)
  {
    if(empty($this->id))
      return;

    $tables = explode("_has_",strtolower($table));
    $table2_class = ucfirst(substr($tables[1],0,-1));

    $q = "SELECT ".$tables[1]."_id FROM `$table` WHERE `".$tables[0]."_id`= $this->id";
    $data = myFetchAssoc($q);

    if(empty($data))
      return;

    $collection = array();
    foreach($data as $row)
    {
      $object = $table2_class::find($row[$tables[1].'_id']);
      $collection[] = $object;
    }

    $this->$tables[1] = $collection;
  }

  public function delete()
  {
    if (empty($this->primaryKey) || empty($this->tableName))
      die('cannot uset class Table without tablename and primary key setted');

    if ($this->{$this->primaryKey} === null)
      die('Trying to delete without having a primary key value');

    $query = "delete from `".$this->tableName."`".
        "where `".$this->primaryKey."`='".$this->{$this->primaryKey}."'";

    myQuery($query);
  }

  public function save()
  {
    $pk = $this->primaryKey;

    if($this->$pk != null) // UPDATE
    {
      $nbFields = count($this->fields);
      $counter = 0;

      $query = "UPDATE `".$this->tableName."` SET";

      foreach($this->fields AS $field)
      {
        $query .= " `".$field['Field']."` = '".myEscape($this->$field['Field'])."'";

        if($counter < ($nbFields - 1))
        {
          $query .= ",";
        }

        $counter++;
      }

      $query .= "WHERE `".$pk."` = '".intval($this->$pk)."'";
      myQuery($query);
    }
    else // INSERT
    {
      $nbFields = count($this->fields);
      $counter = 0;

      $query = "INSERT INTO `".$this->tableName."` (";

      foreach($this->fields AS $field)
      {
        $query .= $field['Field'];

        if($counter < ($nbFields - 1))
        {
          $query .= ',';
        }

        $counter++;
      }

      $query .= ") VALUES (";

      $counter = 0;

      foreach($this->fields AS $field)
      {
        $ob = substr(str_replace("_id","",$field['Field']),0,-1);

        if(is_object($this->$ob))
        {
          $object = $this->$ob;
          $id = $object->getId();
          $query .="'".myEscape($id)."'";
        }
        else
        {
          $query .="'".myEscape($this->$field['Field'])."'";
        }

        if($counter < ($nbFields -1))
        {
          $query .= ",";
        }

        $counter++;
      }
      $query .= ")";

      myQuery($query);
      $insert_id = myLastInsertId();
      $this->$pk = $insert_id;
    }
  }

  public function hydrate()
  {
    if (empty($this->{$this->primaryKey}))
      die (get_called_class().': cannot hydrate without primary key value');

    $q = "SELECT * FROM `".$this->tableName."` WHERE `".$this->primaryKey."` = ".intval($this->{$this->primaryKey});
    $data = myFetchAssoc($q);
    if(count($data) == 1)
      $data = $data[0];

    foreach ($this->fields as $field)
    {
      $this->$field['Field'] = $data[$field['Field']];
    }
  }
}

?>