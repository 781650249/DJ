<?php

use Illuminate\Database\Seeder;

class OauthClientsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('oauth_clients')->delete();
        
        \DB::table('oauth_clients')->insert(array (
            0 => 
            array (
                'id' => 1,
                'user_id' => NULL,
                'name' => 'Laravel Personal Access Client',
                'secret' => 'tLiy2PG0MoNXeCiTAg443EqbIAW2iS4i7jBuH6Qs',
                'redirect' => 'http://localhost',
                'personal_access_client' => 1,
                'password_client' => 0,
                'revoked' => 0,
                'created_at' => '2019-11-22 10:59:04',
                'updated_at' => '2019-11-22 10:59:04',
            ),
            1 => 
            array (
                'id' => 2,
                'user_id' => NULL,
                'name' => 'Laravel Password Grant Client',
                'secret' => '6FeVpNivZeOzgGkASaGZXC2iXVeH8eGM6J2lnGxl',
                'redirect' => 'http://localhost',
                'personal_access_client' => 0,
                'password_client' => 1,
                'revoked' => 0,
                'created_at' => '2019-11-22 10:59:04',
                'updated_at' => '2019-11-22 10:59:04',
            ),
            2 => 
            array (
                'id' => 3,
                'user_id' => NULL,
                'name' => 'erp-dj',
                'secret' => 'PggwVjfP0OiEs1N98YqOlt6oTpTgrIgHs00FVjym',
                'redirect' => 'http://localhost',
                'personal_access_client' => 0,
                'password_client' => 1,
                'revoked' => 0,
                'created_at' => '2019-11-22 14:05:10',
                'updated_at' => '2019-11-22 14:05:10',
            ),
            3 => 
            array (
                'id' => 4,
                'user_id' => NULL,
                'name' => 'Laravel Personal Access Client',
                'secret' => 'g6DSe6rpzqvZ9ihy251ZwLXiXptrCih9JsqyuvEc',
                'redirect' => 'http://localhost',
                'personal_access_client' => 1,
                'password_client' => 0,
                'revoked' => 0,
                'created_at' => '2019-11-25 10:50:03',
                'updated_at' => '2019-11-25 10:50:03',
            ),
            4 => 
            array (
                'id' => 5,
                'user_id' => NULL,
                'name' => 'Laravel Password Grant Client',
                'secret' => 'EhhZGotqn4rHKX0ZQpl44Hrq4rFlYxbC9PiD967J',
                'redirect' => 'http://localhost',
                'personal_access_client' => 0,
                'password_client' => 1,
                'revoked' => 0,
                'created_at' => '2019-11-25 10:50:03',
                'updated_at' => '2019-11-25 10:50:03',
            ),
        ));
        
        
    }
}