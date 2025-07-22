export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      automation_triggers: {
        Row: {
          actions: Json | null
          conditions: Json | null
          cooldown_minutes: number | null
          created_at: string | null
          description: string | null
          empresa_id: string
          enabled: boolean | null
          id: string
          max_activations_per_day: number | null
          name: string
          priority: number | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          conditions?: Json | null
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          empresa_id: string
          enabled?: boolean | null
          id?: string
          max_activations_per_day?: number | null
          name: string
          priority?: number | null
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          conditions?: Json | null
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          empresa_id?: string
          enabled?: boolean | null
          id?: string
          max_activations_per_day?: number | null
          name?: string
          priority?: number | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_triggers_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_whatsapp_connections: {
        Row: {
          automation_id: string
          created_at: string
          id: string
          whatsapp_connection_id: string
        }
        Insert: {
          automation_id: string
          created_at?: string
          id?: string
          whatsapp_connection_id: string
        }
        Update: {
          automation_id?: string
          created_at?: string
          id?: string
          whatsapp_connection_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_whatsapp_connections_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_whatsapp_connections_whatsapp_connection_id_fkey"
            columns: ["whatsapp_connection_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          created_at: string | null
          empresa_id: string
          flow_data: Json | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
          whatsapp_connection_id: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_id: string
          flow_data?: Json | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
          whatsapp_connection_id?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: string
          flow_data?: Json | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          whatsapp_connection_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automations_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automations_whatsapp_connection_id_fkey"
            columns: ["whatsapp_connection_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_flows: {
        Row: {
          activation_mode: string | null
          auto_start_enabled: boolean | null
          created_at: string | null
          empresa_id: string
          id: string
          is_default: boolean | null
          mensagem_inicial: string
          n8n_webhook_url: string | null
          nome: string
          priority: number | null
          status: string
          trigger_conditions: Json | null
          updated_at: string | null
        }
        Insert: {
          activation_mode?: string | null
          auto_start_enabled?: boolean | null
          created_at?: string | null
          empresa_id: string
          id?: string
          is_default?: boolean | null
          mensagem_inicial: string
          n8n_webhook_url?: string | null
          nome: string
          priority?: number | null
          status?: string
          trigger_conditions?: Json | null
          updated_at?: string | null
        }
        Update: {
          activation_mode?: string | null
          auto_start_enabled?: boolean | null
          created_at?: string | null
          empresa_id?: string
          id?: string
          is_default?: boolean | null
          mensagem_inicial?: string
          n8n_webhook_url?: string | null
          nome?: string
          priority?: number | null
          status?: string
          trigger_conditions?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_flows_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_logs: {
        Row: {
          contact_phone: string | null
          correlation_id: string
          created_at: string | null
          current_stage: string | null
          function_name: string
          id: string
          level: string
          message: string
          metadata: Json | null
        }
        Insert: {
          contact_phone?: string | null
          correlation_id: string
          created_at?: string | null
          current_stage?: string | null
          function_name: string
          id?: string
          level?: string
          message: string
          metadata?: Json | null
        }
        Update: {
          contact_phone?: string | null
          correlation_id?: string
          created_at?: string | null
          current_stage?: string | null
          function_name?: string
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      chatbot_nodes: {
        Row: {
          created_at: string | null
          flow_id: string
          id: string
          mensagem: string
          node_id: string
          nome: string
          ordem: number | null
          tipo_resposta: string
        }
        Insert: {
          created_at?: string | null
          flow_id: string
          id?: string
          mensagem: string
          node_id: string
          nome: string
          ordem?: number | null
          tipo_resposta: string
        }
        Update: {
          created_at?: string | null
          flow_id?: string
          id?: string
          mensagem?: string
          node_id?: string
          nome?: string
          ordem?: number | null
          tipo_resposta?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_nodes_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "chatbot_flows"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_options: {
        Row: {
          created_at: string | null
          id: string
          mensagem_final: string | null
          node_id: string
          option_id: string
          ordem: number | null
          proxima_acao: string
          proximo_node_id: string | null
          setor_transferencia: string | null
          texto: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mensagem_final?: string | null
          node_id: string
          option_id: string
          ordem?: number | null
          proxima_acao: string
          proximo_node_id?: string | null
          setor_transferencia?: string | null
          texto: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mensagem_final?: string | null
          node_id?: string
          option_id?: string
          ordem?: number | null
          proxima_acao?: string
          proximo_node_id?: string | null
          setor_transferencia?: string | null
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_options_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "chatbot_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_sessions: {
        Row: {
          conversa_id: string
          created_at: string | null
          current_node_id: string
          flow_id: string
          id: string
          session_data: Json | null
          status: string
          updated_at: string | null
        }
        Insert: {
          conversa_id: string
          created_at?: string | null
          current_node_id: string
          flow_id: string
          id?: string
          session_data?: Json | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          conversa_id?: string
          created_at?: string | null
          current_node_id?: string
          flow_id?: string
          id?: string
          session_data?: Json | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_sessions_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: true
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_sessions_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "chatbot_flows"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_state: {
        Row: {
          contact_phone: string
          context: Json | null
          correlation_id: string | null
          created_at: string | null
          current_stage: string
          id: string
          last_message_id: string | null
          nlp_confidence: number | null
          nlp_intent: string | null
          updated_at: string | null
        }
        Insert: {
          contact_phone: string
          context?: Json | null
          correlation_id?: string | null
          created_at?: string | null
          current_stage?: string
          id?: string
          last_message_id?: string | null
          nlp_confidence?: number | null
          nlp_intent?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_phone?: string
          context?: Json | null
          correlation_id?: string | null
          created_at?: string | null
          current_stage?: string
          id?: string
          last_message_id?: string | null
          nlp_confidence?: number | null
          nlp_intent?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      chatbots: {
        Row: {
          created_at: string | null
          empresa_id: string
          fluxo: Json | null
          id: string
          interacoes: number | null
          mensagem_inicial: string
          nome: string
          status: string
          transferencias: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_id: string
          fluxo?: Json | null
          id?: string
          interacoes?: number | null
          mensagem_inicial: string
          nome: string
          status?: string
          transferencias?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: string
          fluxo?: Json | null
          id?: string
          interacoes?: number | null
          mensagem_inicial?: string
          nome?: string
          status?: string
          transferencias?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbots_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      contatos: {
        Row: {
          created_at: string | null
          email: string | null
          empresa: string | null
          empresa_id: string | null
          id: string
          nome: string
          observacoes: string | null
          tags: string[] | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          empresa?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          empresa?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contatos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      conversas: {
        Row: {
          agente_id: string | null
          canal: string | null
          contato_id: string | null
          created_at: string | null
          empresa_id: string | null
          id: string
          prioridade: string | null
          setor: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          agente_id?: string | null
          canal?: string | null
          contato_id?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          prioridade?: string | null
          setor?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          agente_id?: string | null
          canal?: string | null
          contato_id?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          prioridade?: string | null
          setor?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversas_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversas_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      conversas_internas: {
        Row: {
          created_at: string | null
          empresa_id: string
          id: string
          nome: string | null
          participante_1_id: string
          participante_2_id: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_id: string
          id?: string
          nome?: string | null
          participante_1_id: string
          participante_2_id: string
          tipo?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: string
          id?: string
          nome?: string | null
          participante_1_id?: string
          participante_2_id?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversas_internas_participante_1_id_fkey"
            columns: ["participante_1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversas_internas_participante_2_id_fkey"
            columns: ["participante_2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          ativo: boolean | null
          cnpj: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          id: string
          limite_armazenamento_gb: number | null
          limite_contatos: number | null
          limite_usuarios: number | null
          limite_whatsapp_conexoes: number | null
          nome: string
          plano_id: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          limite_armazenamento_gb?: number | null
          limite_contatos?: number | null
          limite_usuarios?: number | null
          limite_whatsapp_conexoes?: number | null
          nome: string
          plano_id?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          limite_armazenamento_gb?: number | null
          limite_contatos?: number | null
          limite_usuarios?: number | null
          limite_whatsapp_conexoes?: number | null
          nome?: string
          plano_id?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_api_config: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          instance_name: string
          last_connected_at: string | null
          numero: string | null
          qr_code: string | null
          status: string | null
          updated_at: string | null
          webhook_events: string[] | null
          webhook_url: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          instance_name: string
          last_connected_at?: string | null
          numero?: string | null
          qr_code?: string | null
          status?: string | null
          updated_at?: string | null
          webhook_events?: string[] | null
          webhook_url?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          instance_name?: string
          last_connected_at?: string | null
          numero?: string | null
          qr_code?: string | null
          status?: string | null
          updated_at?: string | null
          webhook_events?: string[] | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evolution_api_config_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_api_global_config: {
        Row: {
          api_key: string
          ativo: boolean | null
          created_at: string | null
          id: string
          server_url: string
          updated_at: string | null
          webhook_base_url: string | null
        }
        Insert: {
          api_key: string
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          server_url: string
          updated_at?: string | null
          webhook_base_url?: string | null
        }
        Update: {
          api_key?: string
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          server_url?: string
          updated_at?: string | null
          webhook_base_url?: string | null
        }
        Relationships: []
      }
      failed_messages: {
        Row: {
          correlation_id: string
          created_at: string
          error_message: string
          failure_count: number
          first_failed_at: string
          id: string
          last_failed_at: string
          message_type: string
          metadata: Json | null
          original_message_id: string
          payload: Json
        }
        Insert: {
          correlation_id: string
          created_at?: string
          error_message: string
          failure_count?: number
          first_failed_at?: string
          id?: string
          last_failed_at?: string
          message_type: string
          metadata?: Json | null
          original_message_id: string
          payload: Json
        }
        Update: {
          correlation_id?: string
          created_at?: string
          error_message?: string
          failure_count?: number
          first_failed_at?: string
          id?: string
          last_failed_at?: string
          message_type?: string
          metadata?: Json | null
          original_message_id?: string
          payload?: Json
        }
        Relationships: []
      }
      mensagens: {
        Row: {
          conteudo: string
          conversa_id: string | null
          created_at: string | null
          id: string
          lida: boolean | null
          metadata: Json | null
          remetente_id: string | null
          remetente_nome: string | null
          remetente_tipo: string
          tipo_mensagem: string | null
        }
        Insert: {
          conteudo: string
          conversa_id?: string | null
          created_at?: string | null
          id?: string
          lida?: boolean | null
          metadata?: Json | null
          remetente_id?: string | null
          remetente_nome?: string | null
          remetente_tipo: string
          tipo_mensagem?: string | null
        }
        Update: {
          conteudo?: string
          conversa_id?: string | null
          created_at?: string | null
          id?: string
          lida?: boolean | null
          metadata?: Json | null
          remetente_id?: string | null
          remetente_nome?: string | null
          remetente_tipo?: string
          tipo_mensagem?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens_internas: {
        Row: {
          conteudo: string
          conversa_interna_id: string
          created_at: string | null
          id: string
          lida: boolean | null
          remetente_id: string
          tipo_mensagem: string | null
        }
        Insert: {
          conteudo: string
          conversa_interna_id: string
          created_at?: string | null
          id?: string
          lida?: boolean | null
          remetente_id: string
          tipo_mensagem?: string | null
        }
        Update: {
          conteudo?: string
          conversa_interna_id?: string
          created_at?: string | null
          id?: string
          lida?: boolean | null
          remetente_id?: string
          tipo_mensagem?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_internas_conversa_interna_id_fkey"
            columns: ["conversa_interna_id"]
            isOneToOne: false
            referencedRelation: "conversas_internas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_internas_remetente_id_fkey"
            columns: ["remetente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_queue: {
        Row: {
          correlation_id: string
          created_at: string | null
          error_message: string | null
          id: string
          max_retries: number | null
          message_type: string
          metadata: Json | null
          payload: Json
          priority: number | null
          processed_at: string | null
          retry_count: number | null
          scheduled_at: string | null
          status: string
        }
        Insert: {
          correlation_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          message_type?: string
          metadata?: Json | null
          payload: Json
          priority?: number | null
          processed_at?: string | null
          retry_count?: number | null
          scheduled_at?: string | null
          status?: string
        }
        Update: {
          correlation_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          message_type?: string
          metadata?: Json | null
          payload?: Json
          priority?: number | null
          processed_at?: string | null
          retry_count?: number | null
          scheduled_at?: string | null
          status?: string
        }
        Relationships: []
      }
      n8n_configurations: {
        Row: {
          api_key: string | null
          created_at: string | null
          empresa_id: string
          id: string
          instance_url: string
          last_ping: string | null
          settings: Json | null
          status: string | null
          success_rate: number | null
          total_executions: number | null
          updated_at: string | null
          webhook_receive_url: string | null
          webhook_send_url: string | null
          workflow_count: number | null
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          empresa_id: string
          id?: string
          instance_url: string
          last_ping?: string | null
          settings?: Json | null
          status?: string | null
          success_rate?: number | null
          total_executions?: number | null
          updated_at?: string | null
          webhook_receive_url?: string | null
          webhook_send_url?: string | null
          workflow_count?: number | null
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          empresa_id?: string
          id?: string
          instance_url?: string
          last_ping?: string | null
          settings?: Json | null
          status?: string | null
          success_rate?: number | null
          total_executions?: number | null
          updated_at?: string | null
          webhook_receive_url?: string | null
          webhook_send_url?: string | null
          workflow_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "n8n_configurations_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_execution_logs: {
        Row: {
          config_id: string
          created_at: string | null
          duration_ms: number | null
          end_time: string | null
          error_message: string | null
          execution_id: string
          id: string
          input_data: Json | null
          output_data: Json | null
          start_time: string
          status: string
          workflow_id: string
        }
        Insert: {
          config_id: string
          created_at?: string | null
          duration_ms?: number | null
          end_time?: string | null
          error_message?: string | null
          execution_id: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          start_time: string
          status: string
          workflow_id: string
        }
        Update: {
          config_id?: string
          created_at?: string | null
          duration_ms?: number | null
          end_time?: string | null
          error_message?: string | null
          execution_id?: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          start_time?: string
          status?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "n8n_execution_logs_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "n8n_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      nlp_intents: {
        Row: {
          active: boolean | null
          confidence_threshold: number | null
          created_at: string | null
          empresa_id: string
          id: string
          intent_name: string
          parameters: Json | null
          target_stage: string
          training_phrases: string[] | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          confidence_threshold?: number | null
          created_at?: string | null
          empresa_id: string
          id?: string
          intent_name: string
          parameters?: Json | null
          target_stage: string
          training_phrases?: string[] | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          confidence_threshold?: number | null
          created_at?: string | null
          empresa_id?: string
          id?: string
          intent_name?: string
          parameters?: Json | null
          target_stage?: string
          training_phrases?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nlp_intents_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          limite_armazenamento_gb: number | null
          limite_contatos: number | null
          limite_usuarios: number | null
          nome: string
          pode_usar_api: boolean | null
          pode_usar_automacao: boolean | null
          pode_usar_chat_interno: boolean | null
          pode_usar_chatbot: boolean | null
          pode_usar_kanban: boolean | null
          pode_usar_relatorios: boolean | null
          preco_mensal: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          limite_armazenamento_gb?: number | null
          limite_contatos?: number | null
          limite_usuarios?: number | null
          nome: string
          pode_usar_api?: boolean | null
          pode_usar_automacao?: boolean | null
          pode_usar_chat_interno?: boolean | null
          pode_usar_chatbot?: boolean | null
          pode_usar_kanban?: boolean | null
          pode_usar_relatorios?: boolean | null
          preco_mensal?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          limite_armazenamento_gb?: number | null
          limite_contatos?: number | null
          limite_usuarios?: number | null
          nome?: string
          pode_usar_api?: boolean | null
          pode_usar_automacao?: boolean | null
          pode_usar_chat_interno?: boolean | null
          pode_usar_chatbot?: boolean | null
          pode_usar_kanban?: boolean | null
          pode_usar_relatorios?: boolean | null
          preco_mensal?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          created_at: string | null
          email: string
          empresa_id: string | null
          id: string
          nome: string
          permissoes: Json | null
          setor: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string | null
          email: string
          empresa_id?: string | null
          id: string
          nome: string
          permissoes?: Json | null
          setor?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          permissoes?: Json | null
          setor?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_metricas: {
        Row: {
          atendimentos_pendentes: number | null
          atendimentos_resolvidos: number | null
          created_at: string | null
          data_referencia: string
          empresa_id: string
          id: string
          nps: number | null
          satisfacao_media: number | null
          taxa_resolucao: number | null
          tempo_medio_atendimento: number | null
          total_atendimentos: number | null
          updated_at: string | null
          volume_chat_interno: number | null
          volume_email: number | null
          volume_whatsapp: number | null
        }
        Insert: {
          atendimentos_pendentes?: number | null
          atendimentos_resolvidos?: number | null
          created_at?: string | null
          data_referencia: string
          empresa_id: string
          id?: string
          nps?: number | null
          satisfacao_media?: number | null
          taxa_resolucao?: number | null
          tempo_medio_atendimento?: number | null
          total_atendimentos?: number | null
          updated_at?: string | null
          volume_chat_interno?: number | null
          volume_email?: number | null
          volume_whatsapp?: number | null
        }
        Update: {
          atendimentos_pendentes?: number | null
          atendimentos_resolvidos?: number | null
          created_at?: string | null
          data_referencia?: string
          empresa_id?: string
          id?: string
          nps?: number | null
          satisfacao_media?: number | null
          taxa_resolucao?: number | null
          tempo_medio_atendimento?: number | null
          total_atendimentos?: number | null
          updated_at?: string | null
          volume_chat_interno?: number | null
          volume_email?: number | null
          volume_whatsapp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_metricas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      sentiment_analysis: {
        Row: {
          conversa_id: string | null
          created_at: string | null
          emocao: string | null
          empresa_id: string
          id: string
          mensagem_id: string | null
          palavras_chave: string[] | null
          sentimento_confianca: number | null
          sentimento_score: number | null
          sugestao_ia: string | null
          updated_at: string | null
        }
        Insert: {
          conversa_id?: string | null
          created_at?: string | null
          emocao?: string | null
          empresa_id: string
          id?: string
          mensagem_id?: string | null
          palavras_chave?: string[] | null
          sentimento_confianca?: number | null
          sentimento_score?: number | null
          sugestao_ia?: string | null
          updated_at?: string | null
        }
        Update: {
          conversa_id?: string | null
          created_at?: string | null
          emocao?: string | null
          empresa_id?: string
          id?: string
          mensagem_id?: string | null
          palavras_chave?: string[] | null
          sentimento_confianca?: number | null
          sentimento_score?: number | null
          sugestao_ia?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentiment_analysis_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentiment_analysis_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentiment_analysis_mensagem_id_fkey"
            columns: ["mensagem_id"]
            isOneToOne: false
            referencedRelation: "mensagens"
            referencedColumns: ["id"]
          },
        ]
      }
      setores: {
        Row: {
          agentes_ativos: number | null
          atendimentos_ativos: number | null
          ativo: boolean | null
          capacidade_maxima: number | null
          cor: string | null
          created_at: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
        }
        Insert: {
          agentes_ativos?: number | null
          atendimentos_ativos?: number | null
          ativo?: boolean | null
          capacidade_maxima?: number | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
        }
        Update: {
          agentes_ativos?: number | null
          atendimentos_ativos?: number | null
          ativo?: boolean | null
          capacidade_maxima?: number | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "setores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      setores_sistema: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transferencias: {
        Row: {
          conversa_id: string | null
          created_at: string | null
          de_agente_id: string | null
          id: string
          motivo: string | null
          para_agente_id: string | null
          status: string | null
        }
        Insert: {
          conversa_id?: string | null
          created_at?: string | null
          de_agente_id?: string | null
          id?: string
          motivo?: string | null
          para_agente_id?: string | null
          status?: string | null
        }
        Update: {
          conversa_id?: string | null
          created_at?: string | null
          de_agente_id?: string | null
          id?: string
          motivo?: string | null
          para_agente_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_de_agente_id_fkey"
            columns: ["de_agente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_para_agente_id_fkey"
            columns: ["para_agente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trigger_activations: {
        Row: {
          actions_executed: Json | null
          activation_reason: string
          conditions_met: Json | null
          contact_phone: string
          created_at: string | null
          error_message: string | null
          id: string
          success: boolean | null
          trigger_id: string
        }
        Insert: {
          actions_executed?: Json | null
          activation_reason: string
          conditions_met?: Json | null
          contact_phone: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          success?: boolean | null
          trigger_id: string
        }
        Update: {
          actions_executed?: Json | null
          activation_reason?: string
          conditions_met?: Json | null
          contact_phone?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          success?: boolean | null
          trigger_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trigger_activations_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "automation_triggers"
            referencedColumns: ["id"]
          },
        ]
      }
      video_audio_calls: {
        Row: {
          agente_id: string | null
          contato_id: string | null
          created_at: string | null
          duracao: number | null
          empresa_id: string
          ended_at: string | null
          gravacao_url: string | null
          id: string
          notas: string | null
          qualidade_audio: string | null
          qualidade_video: string | null
          started_at: string | null
          status: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          agente_id?: string | null
          contato_id?: string | null
          created_at?: string | null
          duracao?: number | null
          empresa_id: string
          ended_at?: string | null
          gravacao_url?: string | null
          id?: string
          notas?: string | null
          qualidade_audio?: string | null
          qualidade_video?: string | null
          started_at?: string | null
          status?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          agente_id?: string | null
          contato_id?: string | null
          created_at?: string | null
          duracao?: number | null
          empresa_id?: string
          ended_at?: string | null
          gravacao_url?: string | null
          id?: string
          notas?: string | null
          qualidade_audio?: string | null
          qualidade_video?: string | null
          started_at?: string | null
          status?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_audio_calls_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_audio_calls_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_audio_calls_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_connections: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          empresa_id: string | null
          evolution_instance_name: string | null
          evolution_qr_code: string | null
          evolution_status: string | null
          id: string
          nome: string
          numero: string
          qr_code: string | null
          send_webhook_url: string | null
          status: string | null
          ultimo_ping: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          evolution_instance_name?: string | null
          evolution_qr_code?: string | null
          evolution_status?: string | null
          id?: string
          nome: string
          numero: string
          qr_code?: string | null
          send_webhook_url?: string | null
          status?: string | null
          ultimo_ping?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          evolution_instance_name?: string | null
          evolution_qr_code?: string | null
          evolution_status?: string | null
          id?: string
          nome?: string
          numero?: string
          qr_code?: string | null
          send_webhook_url?: string | null
          status?: string | null
          ultimo_ping?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_connections_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_instances: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          display_name: string | null
          empresa_id: string
          id: string
          instance_name: string
          last_connected_at: string | null
          phone_number: string | null
          qr_code: string | null
          status: string | null
          updated_at: string | null
          webhook_events: string[] | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          display_name?: string | null
          empresa_id: string
          id?: string
          instance_name: string
          last_connected_at?: string | null
          phone_number?: string | null
          qr_code?: string | null
          status?: string | null
          updated_at?: string | null
          webhook_events?: string[] | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          display_name?: string | null
          empresa_id?: string
          id?: string
          instance_name?: string
          last_connected_at?: string | null
          phone_number?: string | null
          qr_code?: string | null
          status?: string | null
          updated_at?: string | null
          webhook_events?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_instances_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      queue_monitoring: {
        Row: {
          avg_age_seconds: number | null
          avg_retries: number | null
          count: number | null
          newest_message: string | null
          oldest_message: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assumir_conversa_atomico: {
        Args: { p_conversa_id: string; p_agente_id: string }
        Returns: boolean
      }
      can_access_profile: {
        Args: { profile_id: string }
        Returns: boolean
      }
      cleanup_old_queue_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_super_admin_profile: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      decrement_setor_atendimentos: {
        Args: { setor_id: string }
        Returns: undefined
      }
      get_next_queue_message: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          correlation_id: string
          message_type: string
          payload: Json
          retry_count: number
        }[]
      }
      get_queue_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_pending: number
          total_processing: number
          total_failed: number
          oldest_pending_age: unknown
          failed_with_retries: number
        }[]
      }
      increment_setor_atendimentos: {
        Args: { setor_id: string }
        Returns: undefined
      }
      invoke_chatbot_queue_processor: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      setup_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
