export enum AuthQueries {
  GET_USER_BY_EMAIL = `SELECT user_id, email, password, role, created_at, updated_at 
                       FROM users WHERE email = $1`,
}

export enum UserQueries {
  GET_USER_BY_ID = `SELECT user_id, email, role, created_at, updated_at 
                    FROM users WHERE user_id = $1`,
  EXISTS_BY_EMAIL = `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`,
}

export enum StudentQueries {
  CREATE = `INSERT INTO students(name, email, age, course, status, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING student_id`,
  
  GET_ALL = `SELECT student_id, name, email, age, course, status, created_by, created_at, updated_at
             FROM students ORDER BY created_at DESC`,
  
  GET_BY_ID = `SELECT student_id, name, email, age, course, status, created_by, created_at, updated_at
               FROM students WHERE student_id = $1`,
  
  UPDATE = `UPDATE students 
            SET name = $2, email = $3, age = $4, course = $5, status = $6, updated_at = NOW()
            WHERE student_id = $1 RETURNING student_id`,
  
  DELETE = `DELETE FROM students WHERE student_id = $1`,
  
  EXISTS_BY_EMAIL = `SELECT EXISTS(SELECT 1 FROM students WHERE email = $1)`,
  
  EXISTS_BY_EMAIL_EXCLUDE_ID = `SELECT EXISTS(SELECT 1 FROM students WHERE email = $1 AND student_id != $2)`,
  
  SEARCH_BY_NAME_OR_EMAIL = `SELECT student_id, name, email, age, course, status, created_by, created_at, updated_at
                             FROM students 
                             WHERE name ILIKE $1 OR email ILIKE $1
                             ORDER BY created_at DESC`,
}